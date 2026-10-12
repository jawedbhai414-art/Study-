import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  RotateCcw,
  Send,
  Grid,
  FileText,
  ListOrdered,
  LayoutTemplate,
  AlertCircle,
  Eye,
  Check,
} from 'lucide-react';
import { ExamPaper, OptionKey, CandidateInfo } from '../types/exam';
import { ExamTimer } from './ExamTimer';
import { QuestionPalette } from './QuestionPalette';
import { OmrSheetModal } from './OmrSheetModal';
import { SubmitConfirmModal } from './SubmitConfirmModal';
import { SpeechButton } from './SpeechButton';

interface ExamScreenProps {
  exam: ExamPaper;
  candidate: CandidateInfo;
  onSubmitExam: (answers: Record<number, OptionKey>, markedForReview: Record<number, boolean>) => void;
  onExitExam: () => void;
}

export const ExamScreen: React.FC<ExamScreenProps> = ({
  exam,
  candidate,
  onSubmitExam,
  onExitExam,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'ONE_BY_ONE' | 'BOOKLET'>('ONE_BY_ONE');
  const [answers, setAnswers] = useState<Record<number, OptionKey>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [isOmrOpen, setIsOmrOpen] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState<boolean>(false);

  const currentQuestion = exam.questions[currentQuestionIndex];
  const optionLetters: OptionKey[] = ['A', 'B', 'C', 'D'];

  const handleSelectOption = (questionId: number, option: OptionKey) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleClearOption = (questionId: number) => {
    setAnswers((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  const handleToggleMarkForReview = (questionId: number) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleConfirmSubmit = () => {
    setIsSubmitModalOpen(false);
    onSubmitExam(answers, markedForReview);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Sticky Exam Control Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-stone-200 shadow-xs px-3 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">
          {/* Left: Exam title & format toggle */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <span className="text-[11px] font-bold text-amber-800 uppercase bg-amber-100 px-2 py-0.5 rounded">
                {exam.subject}
              </span>
              <p className="text-xs font-semibold text-stone-800 truncate max-w-[200px] md:max-w-xs mt-0.5">
                {exam.examTitle}
              </p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
              <button
                onClick={() => setViewMode('ONE_BY_ONE')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition ${
                  viewMode === 'ONE_BY_ONE'
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="एक-एक प्रश्न देखें"
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>एक-एक प्रश्न</span>
              </button>

              <button
                onClick={() => setViewMode('BOOKLET')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition ${
                  viewMode === 'BOOKLET'
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="पूरा प्रश्न पत्र देखें"
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>प्रश्न पुस्तिका रूप</span>
              </button>
            </div>
          </div>

          {/* Right: Timer, OMR Sheet & Submit Button */}
          <div className="flex items-center gap-2">
            {/* Countdown Timer */}
            <ExamTimer
              initialMinutes={exam.suggestedTimeMinutes || 30}
              onTimeUp={handleConfirmSubmit}
            />

            {/* OMR Sheet Button */}
            <button
              onClick={() => setIsOmrOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded-xl shadow-xs transition active:scale-95"
              title="ओएमआर शीट खोलें"
            >
              <Grid className="w-3.5 h-3.5 text-amber-300" />
              <span>OMR शीट</span>
              <span className="hidden sm:inline bg-blue-800 px-1.5 py-0.2 rounded text-[10px]">
                {Object.keys(answers).length}/{exam.questions.length}
              </span>
            </button>

            {/* Mobile palette trigger */}
            <button
              onClick={() => setIsMobilePaletteOpen(!isMobilePaletteOpen)}
              className="md:hidden p-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700"
              title="प्रश्न तालिका"
            >
              <Grid className="w-4 h-4" />
            </button>

            {/* Final Submit Button */}
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-red-700 hover:bg-red-800 text-white rounded-xl shadow transition active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>जमा करें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Column: Questions Area (3 cols on desktop) */}
        <div className="md:col-span-3 space-y-4">
          {viewMode === 'ONE_BY_ONE' ? (
            /* Mode 1: Single Question View (One-by-One) */
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-7 flex flex-col justify-between min-h-[460px]">
              <div>
                {/* Question Header */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm font-mono">
                      {currentQuestion.questionNumber || `प्रश्न ${currentQuestion.id}`}
                    </span>
                    <span className="text-xs font-medium text-stone-500">
                      ({currentQuestionIndex + 1} / {exam.questions.length})
                    </span>
                    {currentQuestion.topic && (
                      <span className="text-xs text-stone-600 bg-stone-100 px-2 py-0.5 rounded hidden sm:inline">
                        {currentQuestion.topic}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <SpeechButton
                      text={currentQuestion.questionText}
                      label="प्रश्न सुनें"
                      size="sm"
                    />
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                      +{currentQuestion.marks} अंक
                    </span>
                  </div>
                </div>

                {/* Question Statement */}
                <h3 className="mt-5 text-base sm:text-lg md:text-xl font-bold text-stone-900 leading-relaxed">
                  {currentQuestion.questionText}
                </h3>

                {/* Options (A, B, C, D) */}
                <div className="mt-6 space-y-3">
                  {currentQuestion.options.map((optionText, optIdx) => {
                    const optKey = optionLetters[optIdx];
                    const isSelected = answers[currentQuestion.id] === optKey;

                    return (
                      <button
                        key={optKey}
                        onClick={() => handleSelectOption(currentQuestion.id, optKey)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition flex items-center gap-3.5 active:scale-[0.99] ${
                          isSelected
                            ? 'border-blue-700 bg-blue-50/70 shadow-sm'
                            : 'border-stone-200 bg-stone-50/40 hover:border-amber-400 hover:bg-amber-50/30 text-stone-800'
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition flex-shrink-0 ${
                            isSelected
                              ? 'bg-blue-700 text-white shadow'
                              : 'border-2 border-stone-300 bg-white text-stone-700'
                          }`}
                        >
                          {optKey}
                        </span>
                        <span className={`text-sm sm:text-base ${isSelected ? 'font-bold text-blue-950' : 'font-medium'}`}>
                          {optionText}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Navigation & Action Bar */}
              <div className="pt-6 mt-6 border-t border-stone-200 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleMarkForReview(currentQuestion.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition ${
                      markedForReview[currentQuestion.id]
                        ? 'bg-purple-100 text-purple-900 border-purple-300'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>
                      {markedForReview[currentQuestion.id]
                        ? 'समीक्षा से हटाएं'
                        : 'समीक्षा के लिए चिह्नित करें'}
                    </span>
                  </button>

                  {answers[currentQuestion.id] && (
                    <button
                      onClick={() => handleClearOption(currentQuestion.id)}
                      className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>उत्तर साफ़ करें</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>पिछला</span>
                  </button>

                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.min(exam.questions.length - 1, prev + 1)
                      )
                    }
                    disabled={currentQuestionIndex === exam.questions.length - 1}
                    className="flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-xl bg-stone-900 hover:bg-stone-800 text-white disabled:opacity-40 disabled:cursor-not-allowed transition shadow"
                  >
                    <span>अगला</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Mode 2: Traditional Booklet Format (Continuous Scroll) */
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900">
                <strong>प्रश्न पुस्तिका प्रारूप (Exam Booklet Format):</strong> सभी प्रश्न एक साथ नीचे दिए गए हैं। आप प्रत्येक प्रश्न के नीचे दिए गए वृत्त (A, B, C, D) को चुनकर उत्तर दे सकते हैं।
              </div>

              {exam.questions.map((q, qIndex) => {
                const selectedOpt = answers[q.id];

                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs transition ${
                      selectedOpt ? 'border-blue-300 bg-blue-50/20' : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded">
                          {q.questionNumber || `प्रश्न ${q.id}`}
                        </span>
                        {q.topic && (
                          <span className="text-[11px] text-stone-500">
                            • {q.topic}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-stone-500">
                        1 अंक
                      </span>
                    </div>

                    <h4 className="mt-3 text-sm sm:text-base font-bold text-stone-900 leading-relaxed">
                      {q.questionText}
                    </h4>

                    {/* Radio Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                      {q.options.map((optionText, optIdx) => {
                        const optKey = optionLetters[optIdx];
                        const isSelected = selectedOpt === optKey;

                        return (
                          <button
                            key={optKey}
                            onClick={() => handleSelectOption(q.id, optKey)}
                            className={`p-2.5 rounded-xl border text-left text-xs sm:text-sm flex items-center gap-2.5 transition ${
                              isSelected
                                ? 'border-blue-700 bg-blue-50 text-blue-950 font-bold ring-1 ring-blue-500'
                                : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-800'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                isSelected
                                  ? 'bg-blue-700 text-white'
                                  : 'border border-stone-400 bg-white text-stone-700'
                              }`}
                            >
                              {optKey}
                            </span>
                            <span>{optionText}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Question Palette (Always visible on Desktop) */}
        <div className="hidden md:block md:col-span-1">
          <div className="sticky top-16">
            <QuestionPalette
              totalQuestions={exam.questions.length}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              markedForReview={markedForReview}
              onSelectQuestion={(idx) => {
                setCurrentQuestionIndex(idx);
                setViewMode('ONE_BY_ONE');
              }}
            />

            {/* Quick Candidate summary card */}
            <div className="mt-4 p-3 bg-white rounded-2xl border border-stone-200 text-xs text-stone-600">
              <span className="block font-bold text-stone-800">परीक्षार्थी विवरण</span>
              <p className="mt-1">नाम: <strong>{candidate.name}</strong></p>
              <p>रोल नं: <strong className="font-mono">{candidate.rollNumber}</strong></p>
              <p className="text-[11px] text-stone-500 mt-1">
                उत्तर स्वतः सुरक्षित हो रहे हैं।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Question Palette */}
      {isMobilePaletteOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden flex flex-col justify-end">
          <div className="bg-white rounded-t-3xl p-4 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 mb-2 border-b">
              <span className="font-bold text-sm text-stone-800">सभी प्रश्न (Question Palette)</span>
              <button
                onClick={() => setIsMobilePaletteOpen(false)}
                className="text-xs bg-stone-100 px-2 py-1 rounded"
              >
                बंद करें
              </button>
            </div>
            <QuestionPalette
              totalQuestions={exam.questions.length}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              markedForReview={markedForReview}
              onSelectQuestion={(idx) => {
                setCurrentQuestionIndex(idx);
                setViewMode('ONE_BY_ONE');
                setIsMobilePaletteOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* OMR Sheet Modal */}
      <OmrSheetModal
        isOpen={isOmrOpen}
        onClose={() => setIsOmrOpen(false)}
        totalQuestions={exam.questions.length}
        answers={answers}
        onSelectOption={handleSelectOption}
        onClearOption={handleClearOption}
      />

      {/* Submit Confirmation Modal */}
      <SubmitConfirmModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
        totalQuestions={exam.questions.length}
        answers={answers}
        markedForReview={markedForReview}
      />
    </div>
  );
};
