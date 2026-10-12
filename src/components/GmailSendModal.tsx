import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ExternalLink,
  ShieldCheck,
  User,
} from 'lucide-react';
import {
  sendGmailMessage,
  buildResultEmailHtml,
  buildQuestionPaperEmailHtml,
} from '../services/gmailService';
import { googleSignIn, getAccessToken } from '../services/firebaseAuth';
import { CandidateInfo, ExamPaper, ExamResult } from '../types/exam';

interface GmailSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateInfo;
  exam: ExamPaper;
  result?: ExamResult | null;
  mode: 'RESULT' | 'QUESTION_PAPER';
  userEmail?: string | null;
}

export const GmailSendModal: React.FC<GmailSendModalProps> = ({
  isOpen,
  onClose,
  candidate,
  exam,
  result,
  mode,
  userEmail,
}) => {
  const [recipientEmail, setRecipientEmail] = useState<string>(userEmail || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  if (!isOpen) return null;

  const defaultSubject =
    mode === 'RESULT' && result
      ? `[BSEB मैट्रिक 2025] ${candidate.name} का परीक्षा परिणाम - ${exam.subject} (${result.marksObtained}/${result.totalMarks})`
      : `[BSEB मैट्रिक 2025] प्रश्न पत्र - ${exam.subject} (${exam.examTitle})`;

  const emailHtml =
    mode === 'RESULT' && result
      ? buildResultEmailHtml(candidate, exam, result)
      : buildQuestionPaperEmailHtml(exam);

  const handleSend = async () => {
    if (!recipientEmail || !recipientEmail.includes('@')) {
      setErrorMessage('कृपया मान्य ईमेल पता (Email Address) दर्ज करें।');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      let token = await getAccessToken();
      if (!token) {
        // Authenticate via Google popup
        const authRes = await googleSignIn();
        token = authRes?.accessToken || null;
      }

      if (!token) {
        throw new Error('Google खाते से प्रमाणीकरण पूरा नहीं हो सका।');
      }

      await sendGmailMessage({
        to: recipientEmail,
        subject: defaultSubject,
        htmlBody: emailHtml,
      });

      setIsSuccess(true);
      setIsLoading(false);
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      setErrorMessage(
        err.message || 'जीमेल द्वारा ईमेल भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।'
      );
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsConfirming(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-800 to-amber-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base font-heading">
              {mode === 'RESULT'
                ? 'जीमेल द्वारा अंक पत्रक भेजें (Send Result via Gmail)'
                : 'जीमेल द्वारा प्रश्न पत्र भेजें (Send Exam via Gmail)'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-stone-800 text-sm">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-stone-900">ईमेल सफलतापूर्वक भेजा गया!</h4>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                अंक पत्रक और परीक्षा विवरण <strong>{recipientEmail}</strong> पर जीमेल के माध्यम से प्रेषित कर दिया गया है।
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow transition"
              >
                ठीक है (Close)
              </button>
            </div>
          ) : isConfirming ? (
            /* Explicit User Confirmation Step required by Google Workspace guidelines */
            <div className="space-y-4">
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
                <div className="flex items-center gap-2 text-amber-900 font-bold mb-1">
                  <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
                  <span>पुष्टि करें: क्या आप यह ईमेल भेजना चाहते हैं?</span>
                </div>
                <p className="text-xs text-amber-950/90 leading-relaxed">
                  यह क्रिया आपके अधिकृत <strong>Google / Gmail</strong> खाते से नीचे दिए गए पते पर ईमेल संदेश भेजेगी:
                </p>

                <div className="mt-3 bg-white p-3 rounded-lg border border-amber-200 text-xs space-y-1.5 font-mono">
                  <div>
                    <span className="text-stone-500">प्राप्तकर्ता (To): </span>
                    <strong className="text-stone-900">{recipientEmail}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">विषय (Subject): </span>
                    <span className="text-stone-800 truncate block">{defaultSubject}</span>
                  </div>
                  <div>
                    <span className="text-stone-500">प्रेषक (From): </span>
                    <span className="text-stone-800">आपका जीमेल खाता (Your Google Account)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfirming(false)}
                  disabled={isLoading}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition"
                >
                  संशोधन करें (Edit)
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow transition active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>जीमेल से भेजा जा रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>हाँ, जीमेल से भेजें (Confirm & Send)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Email Configuration Step */
            <div className="space-y-4">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-600">
                परीक्षार्थी, माता-पिता या शिक्षक के ईमेल पते पर आधिकारिक बिहार बोर्ड अंक पत्रक और विश्लेषण भेजें।
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  प्राप्तकर्ता ईमेल पता (Recipient Email Address) *
                </label>
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="उदाहरण: student@gmail.com या parent@gmail.com"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  विषय (Email Subject)
                </label>
                <input
                  type="text"
                  readOnly
                  value={defaultSubject}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-stone-100 text-stone-700 font-mono"
                />
              </div>

              {/* Preview Box */}
              <div>
                <span className="block text-xs font-bold text-stone-700 mb-1">
                  ईमेल प्रारूप पूर्वावलोकन (Preview Summary)
                </span>
                <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl text-xs space-y-1">
                  <p>
                    <strong>परीक्षार्थी:</strong> {candidate.name} ({candidate.rollNumber})
                  </p>
                  <p>
                    <strong>विषय:</strong> {exam.subject}
                  </p>
                  {result && (
                    <p>
                      <strong>प्राप्तांक:</strong> {result.marksObtained}/{result.totalMarks} ({result.percentage.toFixed(1)}%) • {result.division}
                    </p>
                  )}
                  <p className="text-[11px] text-stone-500 mt-1">
                    ईमेल में बिहार बोर्ड का आधिकारिक ग्रेड कार्ड टेबल और सांख्यिकी शामिल रहेगी।
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition"
                >
                  रद्द करें
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirming(true)}
                  disabled={!recipientEmail || !recipientEmail.includes('@')}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow transition disabled:opacity-50"
                >
                  <span>आगे बढ़ें (Proceed to Send)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
