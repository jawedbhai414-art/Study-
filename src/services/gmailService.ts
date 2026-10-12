import { getAccessToken } from './firebaseAuth';
import { CandidateInfo, ExamPaper, ExamResult } from '../types/exam';

// Helper to convert UTF-8 string to base64url safely
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Encode UTF-8 for email headers (RFC 2047)
function encodeSubject(subject: string): string {
  const bytes = new TextEncoder().encode(subject);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `=?utf-8?B?${btoa(binary)}?=`;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  htmlBody: string;
}

export const sendGmailMessage = async (payload: SendEmailPayload): Promise<{ id: string; threadId: string }> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('जीमेल एक्सेस टोकन उपलब्ध नहीं है। कृपया पहले Google से साइन इन करें।');
  }

  const emailRaw = [
    `To: ${payload.to}`,
    `Subject: ${encodeSubject(payload.subject)}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    payload.htmlBody,
  ].join('\r\n');

  const encodedMessage = base64UrlEncode(emailRaw);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedMessage,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `जीमेल संदेश भेजने में विफलता (HTTP ${response.status})`
    );
  }

  return await response.json();
};

// Generates an HTML report for an exam result
export const buildResultEmailHtml = (
  candidate: CandidateInfo,
  exam: ExamPaper,
  result: ExamResult
): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Noto Sans Devanagari', 'Segoe UI', Arial, sans-serif; background-color: #f7f5f2; margin: 0; padding: 20px; color: #292524; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e7e5e4; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #78350f, #451a03); color: #ffffff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: bold; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #fde68a; }
    .badge { display: inline-block; background: rgba(251, 191, 36, 0.2); border: 1px solid rgba(251, 191, 36, 0.4); padding: 4px 12px; border-radius: 20px; font-size: 11px; margin-top: 8px; color: #fef3c7; }
    .body { padding: 24px; }
    .student-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
    .student-table td { padding: 8px; border-bottom: 1px solid #f5f5f4; }
    .student-table td.label { color: #78716c; font-weight: 600; width: 40%; }
    .student-table td.val { font-weight: bold; color: #1c1917; }
    .score-box { background: #fefce8; border: 2px dashed #facc15; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0; }
    .score-val { font-size: 36px; font-weight: 900; color: #78350f; font-family: monospace; }
    .division-tag { display: inline-block; background: #166534; color: white; padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: bold; margin-top: 8px; }
    .stats-grid { display: table; width: 100%; margin: 16px 0; }
    .stat-cell { display: table-cell; width: 25%; text-align: center; padding: 10px; background: #f5f5f4; border-radius: 8px; }
    .stat-cell.green { background: #ecfdf5; color: #065f46; }
    .stat-cell.red { background: #fef2f2; color: #991b1b; }
    .footer { background: #1c1917; color: #a8a29e; padding: 16px; text-align: center; font-size: 11px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>बिहार विद्यालय परीक्षा समिति, पटना</h1>
      <p>BIHAR SCHOOL EXAMINATION BOARD, PATNA</p>
      <div class="badge">माध्यमिक स्कूल परीक्षा (कक्षा 10वीं) ऑनलाइन अंक पत्रक</div>
    </div>
    <div class="body">
      <table class="student-table">
        <tr>
          <td class="label">परीक्षार्थी का नाम:</td>
          <td class="val">${candidate.name}</td>
        </tr>
        <tr>
          <td class="label">रोल कोड / रोल नंबर:</td>
          <td class="val">${candidate.rollCode} - ${candidate.rollNumber}</td>
        </tr>
        <tr>
          <td class="label">विषय (Subject):</td>
          <td class="val">${exam.subject}</td>
        </tr>
        <tr>
          <td class="label">विद्यालय का नाम:</td>
          <td class="val">${candidate.schoolName || 'राजकीय उच्च विद्यालय'}</td>
        </tr>
      </table>

      <div class="score-box">
        <div style="font-size: 12px; color: #854d0e; font-weight: bold; text-transform: uppercase;">कुल प्राप्तांक (Marks Obtained)</div>
        <div class="score-val">${result.marksObtained} / ${result.totalMarks}</div>
        <div style="font-size: 15px; font-weight: bold; color: #713f12; margin-top: 4px;">प्रतिशत: ${result.percentage.toFixed(1)}%</div>
        <div class="division-tag">${result.division}</div>
      </div>

      <div class="stats-grid">
        <div class="stat-cell green">
          <div style="font-size: 11px; font-weight: bold;">सही उत्तर</div>
          <div style="font-size: 20px; font-weight: bold;">${result.correctCount}</div>
        </div>
        <div style="display: table-cell; width: 4%;"></div>
        <div class="stat-cell red">
          <div style="font-size: 11px; font-weight: bold;">गलत उत्तर</div>
          <div style="font-size: 20px; font-weight: bold;">${result.wrongCount}</div>
        </div>
        <div style="display: table-cell; width: 4%;"></div>
        <div class="stat-cell">
          <div style="font-size: 11px; font-weight: bold;">अनुत्तरित</div>
          <div style="font-size: 20px; font-weight: bold;">${result.unansweredCount}</div>
        </div>
        <div style="display: table-cell; width: 4%;"></div>
        <div class="stat-cell">
          <div style="font-size: 11px; font-weight: bold;">कुल प्रश्न</div>
          <div style="font-size: 20px; font-weight: bold;">${result.totalQuestions}</div>
        </div>
      </div>

      <p style="font-size: 12px; color: #78716c; line-height: 1.5; margin-top: 20px;">
        यह अंक पत्रक <strong>बिहार बोर्ड कक्षा 10वीं ऑनलाइन परीक्षा पोर्टल</strong> द्वारा स्वचालित रूप से तैयार और प्रेषित किया गया है।
      </p>
    </div>
    <div class="footer">
      बिहार विद्यालय परीक्षा समिति, पटना • BSEB Matric Online Examination Portal
    </div>
  </div>
</body>
</html>
  `.trim();
};

// Generates an HTML document for a question paper
export const buildQuestionPaperEmailHtml = (
  exam: ExamPaper
): string => {
  const questionsHtml = exam.questions
    .map(
      (q, idx) => `
    <div style="margin-bottom: 16px; padding: 12px; background: #fafaf9; border-radius: 8px; border: 1px solid #e7e5e4;">
      <div style="font-weight: bold; font-size: 14px; color: #1c1917; margin-bottom: 8px;">
        ${q.questionNumber || `प्रश्न ${idx + 1}`}. ${q.questionText}
      </div>
      <div style="font-size: 13px; color: #44403c; margin-left: 12px;">
        ${q.options.map((opt, optIdx) => `<div>(${String.fromCharCode(65 + optIdx)}) ${opt}</div>`).join('')}
      </div>
    </div>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Noto Sans Devanagari', 'Segoe UI', Arial, sans-serif; background-color: #f7f5f2; margin: 0; padding: 20px; }
    .card { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e7e5e4; }
    .header { background: linear-gradient(135deg, #78350f, #451a03); color: #ffffff; padding: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 style="margin: 0; color: #ffffff;">बिहार विद्यालय परीक्षा समिति, पटना</h2>
      <p style="margin: 4px 0 0; color: #fde68a; font-size: 14px;">${exam.subject} - ${exam.examTitle}</p>
      <div style="font-size: 12px; color: #fef3c7; margin-top: 6px;">कुल पूर्णांक: ${exam.totalMarks} | समय: ${exam.suggestedTimeMinutes} मिनट</div>
    </div>
    <div style="padding: 20px;">
      <div style="margin-bottom: 16px; font-size: 12px; color: #78716c; background: #fefce8; padding: 10px; border-radius: 8px; border: 1px solid #fef08a;">
        <strong>निर्देश:</strong> सभी प्रश्न वस्तुनिष्ठ हैं। प्रत्येक प्रश्न का 1 अंक निर्धारित है।
      </div>
      ${questionsHtml}
    </div>
  </div>
</body>
</html>
  `.trim();
};
