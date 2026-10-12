import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Printer,
  FileText,
  TrendingUp,
  Share2,
  Filter,
  ChevronDown,
  BookOpen,
  Mail,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { ExamPaper, ExamResult, CandidateInfo, OptionKey } from '../types/exam';
import { saveMistakesFromResult } from '../utils/mistakeStore';
import { recordDailyChallengeCompleted } from '../utils/streakStore';
import { SpeechButton } from './SpeechButton';

interface ResultViewProps {
  exam: ExamPaper;
  result: ExamResult;
  candidate: CandidateInfo;
  onRetakeExam: () => void;
  onChooseNewExam: () => void;
  onOpenGmailSend: () => void;
  onOpenNcertBook: (
    questionText: string,
    topic?: string,
    explanation?: string,
    correctOptionText?: string
  ) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  exam,
  result,
  candidate,
  onRetakeExam,
  onChooseNewExam,
  onOpenGmailSend,
  onOpenNcertBook,
}) => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'CORRECT' | 'WRONG' | 'UNANSWERED'>('ALL');

  useEffect(() => {
    // Automatically save wrong questions to student's Mistake Notebook
    saveMistakesFromResult(exam, result);

    // If this was a daily challenge, mark completed
    if (exam.id.startsWith('daily-challenge')) {
      recordDailyChallengeCompleted();
    }

    // Launch celebratory confetti if student achieved First or Second Division
    if (result.percentage >= 45) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [exam, result]);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🎯 बिहार बोर्ड मैट्रिक 2025-26 ऑनलाइन टेस्ट रिज़ल्ट\n` +
      `👤 परीक्षार्थी: ${candidate.name}\n` +
      `📖 विषय: ${exam.subject}\n` +
      `🏆 प्राप्तांक: ${result.marksObtained}/${result.totalMarks} (${result.percentage.toFixed(1)}%)\n` +
      `🎖️ श्रेणी: ${result.division}\n` +
      `✅ सही: ${result.correctCount} | ❌ गलत: ${result.wrongCount}\n` +
      `👉 आप भी ऑनलाइन टेस्ट दें: ${window.location.origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Filter questions based on filterMode
  const filteredQuestions = exam.questions.filter((q) => {
    const userChoice = result.answers[q.id];
    const isAnswered = userChoice !== undefined;
    const isCorrect = isAnswered && userChoice === q.correctOption;

    if (filterMode === 'CORRECT') return isCorrect;
    if (filterMode === 'WRONG') return isAnswered && !isCorrect;
    if (filterMode === 'UNANSWERED') return !isAnswered;
    return true;
  });

  const accuracy = result.attemptedCount > 0
    ? Math.round((result.correctCount / result.attemptedCount) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Official BSEB Marksheet Card */}
      <div className="bg-white rounded-3xl border-2 border-stone-300 shadow-xl overflow-hidden print:border-none print:shadow-none">
        {/* Certificate Style Header */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-red-950 text-white p-5 text-center relative border-b-4 border-amber-600">
          <div className="inline-block p-2 rounded-full bg-white/10 border border-amber-400 mb-2">
            <Award className="w-8 h-8 text-amber-300 mx-auto" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading tracking-wide">
            बिहार विद्यालय परीक्षा समिति, पटना
          </h2>
          <p className="text-xs sm:text-sm text-amber-200 font-medium">
            BIHAR SCHOOL EXAMINATION BOARD, PATNA
          </p>
          <div className="inline-block mt-2 bg-amber-500/20 text-amber-100 text-xs px-3 py-1 rounded-full border border-amber-400/30">
            माध्यमिक स्कूल परीक्षा (मैट्रिक) - ऑनलाइन मूल्यांकन परिणाम 2025-26
          </div>
        </div>

        {/* Student Credential Table */}
        <div className="p-5 border-b border-stone-200 bg-amber-50/30">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-white rounded-xl border border-stone-200">
              <span className="text-stone-500 block text-[11px]">परीक्षार्थी का नाम</span>
              <span className="font-bold text-stone-900 text-sm">{candidate.name}</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-stone-200">
              <span className="text-stone-500 block text-[11px]">रोल कोड / रोल नं.</span>
              <span className="font-mono font-bold text-stone-900 text-sm">
                {candidate.rollCode} - {candidate.rollNumber}
              </span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-stone-200">
              <span className="text-stone-500 block text-[11px]">विषय (Subject)</span>
              <span className="font-bold text-stone-900 truncate block">{exam.subject}</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-stone-200">
              <span className="text-stone-500 block text-[11px]">विद्यालय (School)</span>
              <span className="font-medium text-stone-800 truncate block">
                {candidate.schoolName || 'राजकीय उच्च विद्यालय'}
              </span>
            </div>
          </div>
        </div>

        {/* Big Score & Division Display */}
        <div className="p-6 text-center border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white">
          <div className="max-w-md mx-auto">
            <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">
              कुल प्राप्तांक (Total Score)
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-2">
              <span className="text-4xl sm:text-5xl font-black text-amber-900 font-mono">
                {result.marksObtained}
              </span>
              <span className="text-xl sm:text-2xl text-stone-500 font-mono font-semibold">
                / {result.totalMarks}
              </span>
            </div>

            {/* Percentage & Division Badge */}
            <div className="mt-3 flex items-center justify-center gap-3 flex-wrap">
              <span className="text-sm sm:text-base font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300 font-mono">
                {result.percentage.toFixed(1)}%
              </span>
              <span
                className={`text-sm sm:text-base font-bold px-4 py-1 rounded-full border shadow-xs ${
                  result.percentage >= 60
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : result.percentage >= 45
                    ? 'bg-blue-100 text-blue-900 border-blue-300'
                    : result.percentage >= 30
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-red-100 text-red-900 border-red-300'
                }`}
              >
                {result.division}
              </span>
            </div>
          </div>

          {/* 4 Analytics Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <div className="flex items-center justify-center gap-1.5 text-emerald-700 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold">सही उत्तर</span>
              </div>
              <span className="text-2xl font-black text-emerald-800 font-mono">
                {result.correctCount}
              </span>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center justify-center gap-1.5 text-red-700 mb-1">
                <XCircle className="w-4 h-4" />
                <span className="text-xs font-semibold">गलत उत्तर</span>
              </div>
              <span className="text-2xl font-black text-red-800 font-mono">
                {result.wrongCount}
              </span>
            </div>

            <div className="p-3 bg-stone-100 border border-stone-200 rounded-2xl">
              <div className="flex items-center justify-center gap-1.5 text-stone-600 mb-1">
                <HelpCircle className="w-4 h-4" />
                <span className="text-xs font-semibold">अनुत्तरित</span>
              </div>
              <span className="text-2xl font-black text-stone-700 font-mono">
                {result.unansweredCount}
              </span>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
              <div className="flex items-center justify-center gap-1.5 text-amber-700 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-semibold">सटीकता (Accuracy)</span>
              </div>
              <span className="text-2xl font-black text-amber-800 font-mono">
                {accuracy}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="no-print p-4 bg-stone-100 flex items-center justify-between flex-wrap gap-2 border-t border-stone-200">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-bold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-700" />
              <span>अंक पत्र प्रिंट</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
              title="व्हाट्सएप पर रिज़ल्ट शेयर करें"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp शेयर</span>
            </button>

            <button
              onClick={onOpenGmailSend}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
              title="जीमेल पर अंक पत्र भेजें"
            >
              <Mail className="w-4 h-4 text-amber-200" />
              <span>Gmail भेजें</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRetakeExam}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl shadow transition active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>पुनः परीक्षा दें (Retake)</span>
            </button>

            <button
              onClick={onChooseNewExam}
              className="flex items-center gap-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-xl shadow transition active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>अन्य विषय / PDF चुनें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Question by Question Detailed Review with Explanations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 font-heading">
              प्रश्नोत्तर विस्तृत समाधान एवं उत्तर कुंजी (Answer Key & Solutions)
            </h3>
            <p className="text-xs text-stone-600">
              प्रत्येक प्रश्न का सही उत्तर, आपका चयन तथा विस्तृत हिन्दी व्याख्या नीचे दी गई है।
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="no-print flex items-center gap-1 bg-stone-200/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterMode('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === 'ALL'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              सभी ({exam.questions.length})
            </button>
            <button
              onClick={() => setFilterMode('WRONG')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === 'WRONG'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-red-700 hover:bg-red-50'
              }`}
            >
              गलत ({result.wrongCount})
            </button>
            <button
              onClick={() => setFilterMode('CORRECT')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === 'CORRECT'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              सही ({result.correctCount})
            </button>
            <button
              onClick={() => setFilterMode('UNANSWERED')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === 'UNANSWERED'
                  ? 'bg-stone-600 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-300'
              }`}
            >
              अनुत्तरित ({result.unansweredCount})
            </button>
          </div>
        </div>

        {/* Question Cards List */}
        <div className="space-y-3">
          {filteredQuestions.map((q) => {
            const userChoice = result.answers[q.id];
            const isAnswered = userChoice !== undefined;
            const isCorrect = isAnswered && userChoice === q.correctOption;
            const optionLetters: OptionKey[] = ['A', 'B', 'C', 'D'];

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition ${
                  !isAnswered
                    ? 'border-stone-200'
                    : isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-red-300 bg-red-50/20'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-stone-100 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md font-bold text-xs bg-stone-100 text-stone-800 font-mono">
                      {q.questionNumber || `प्रश्न ${q.id}`}
                    </span>
                    {q.topic && (
                      <span className="text-[11px] font-medium text-stone-500 hidden sm:inline">
                        • {q.topic}
                      </span>
                    )}
                    <SpeechButton
                      text={`${q.questionText}. आधिकारिक सही उत्तर: ${q.options[optionLetters.indexOf(q.correctOption)] || ''}. व्याख्या: ${q.explanation}`}
                      label="सुनें"
                      size="sm"
                    />
                  </div>

                  <div>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        सही (+{q.marks} अंक)
                      </span>
                    ) : isAnswered ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" />
                        गलत (0 अंक)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full">
                        <HelpCircle className="w-3.5 h-3.5" />
                        अनुत्तरित
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <h4 className="mt-3 text-sm sm:text-base font-semibold text-stone-900 leading-relaxed">
                  {q.questionText}
                </h4>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3.5">
                  {q.options.map((optionText, optIdx) => {
                    const optKey = optionLetters[optIdx];
                    const isOfficialCorrect = q.correctOption === optKey;
                    const isUserPick = userChoice === optKey;

                    let optStyle = 'border-stone-200 bg-stone-50/50 text-stone-700';

                    if (isOfficialCorrect) {
                      optStyle = 'border-emerald-500 bg-emerald-100/70 text-emerald-950 font-bold ring-2 ring-emerald-400';
                    } else if (isUserPick && !isCorrect) {
                      optStyle = 'border-red-400 bg-red-100/70 text-red-950 font-semibold line-through';
                    }

                    return (
                      <div
                        key={optKey}
                        className={`p-2.5 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 transition ${optStyle}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            isOfficialCorrect
                              ? 'bg-emerald-600 text-white'
                              : isUserPick && !isCorrect
                              ? 'bg-red-600 text-white'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {optKey}
                        </span>
                        <div className="flex-1 mt-0.5">
                          <span>{optionText}</span>
                          {isOfficialCorrect && (
                            <span className="block text-[10px] text-emerald-800 font-bold mt-0.5">
                              ✓ आधिकारिक सही उत्तर (Correct Answer)
                            </span>
                          )}
                          {isUserPick && !isCorrect && (
                            <span className="block text-[10px] text-red-700 font-semibold mt-0.5">
                              ✗ आपका चयनित विकल्प (Your Choice)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                {q.explanation && (
                  <div className="mt-3.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                      <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                      <span>विस्तृत हल व व्याख्या (Explanation):</span>
                    </div>
                    <p className="leading-relaxed text-stone-800 pl-5">
                      {q.explanation}
                    </p>
                  </div>
                )}

                {/* Special Wrong Answer NCERT Callout */}
                {!isCorrect && isAnswered && (
                  <div className="mt-3.5 p-3.5 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-400 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-800 flex-shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4 text-amber-700 animate-pulse" />
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                          <span>गलत उत्तर! सीधे NCERT पाठ्यपुस्तक से अवधारणा सीखें</span>
                          <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                            रिवीजन आवश्यक
                          </span>
                        </h5>
                        <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
                          बटन दबाते ही आप सीधे संबंधित अध्याय पर पहुँचेंगे जहाँ आधिकारिक सही उत्तर <strong className="bg-yellow-300 text-stone-950 px-1 py-0.2 rounded font-black">पीले मार्कर से हाइलाइट</strong> किया हुआ मिलेगा।
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const correctOptIdx = optionLetters.indexOf(q.correctOption);
                        const correctOptText = q.options[correctOptIdx] || '';
                        onOpenNcertBook(q.questionText, q.topic, q.explanation, correctOptText);
                      }}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md transition transform active:scale-95 flex-shrink-0"
                    >
                      <BookOpen className="w-4 h-4 text-amber-100" />
                      <span>📖 किताब में उत्तर देखें (हाइलाइट)</span>
                    </button>
                  </div>
                )}

                {/* General NCERT Reference Bar */}
                <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
                    <Bookmark className="w-3.5 h-3.5 text-amber-700" />
                    <span>NCERT पाठ्यपुस्तक संदर्भ:</span>
                    <span className="font-semibold text-stone-800">{q.topic || exam.subject}</span>
                  </div>

                  <button
                    onClick={() => {
                      const correctOptIdx = optionLetters.indexOf(q.correctOption);
                      const correctOptText = q.options[correctOptIdx] || '';
                      onOpenNcertBook(q.questionText, q.topic, q.explanation, correctOptText);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-amber-100 text-amber-950 border border-stone-200 transition transform active:scale-95"
                    title="NCERT पाठ्यपुस्तक में इस टॉपिक को पढ़ें"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-900" />
                    <span>📖 NCERT पुस्तक में देखें</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
