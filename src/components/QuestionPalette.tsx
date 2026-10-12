import React from 'react';
import { CheckCircle2, Bookmark, HelpCircle } from 'lucide-react';
import { OptionKey } from '../types/exam';

interface QuestionPaletteProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answers: Record<number, OptionKey>;
  markedForReview: Record<number, boolean>;
  onSelectQuestion: (index: number) => void;
  className?: string;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  totalQuestions,
  currentQuestionIndex,
  answers,
  markedForReview,
  onSelectQuestion,
  className = '',
}) => {
  // Counts
  let answeredCount = 0;
  let reviewCount = 0;
  let answeredAndReviewCount = 0;

  for (let i = 1; i <= totalQuestions; i++) {
    const isAnswered = answers[i] !== undefined;
    const isMarked = markedForReview[i] === true;

    if (isAnswered && isMarked) answeredAndReviewCount++;
    else if (isAnswered) answeredCount++;
    else if (isMarked) reviewCount++;
  }

  const unattemptedCount = totalQuestions - (answeredCount + answeredAndReviewCount);

  return (
    <div className={`bg-white rounded-2xl border border-stone-200 shadow-sm p-4 flex flex-col ${className}`}>
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
          प्रश्न तालिका (Question Palette)
        </h4>
        <span className="text-xs font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
          कुल: {totalQuestions}
        </span>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 my-3 text-[11px] text-stone-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-600 border border-emerald-700 flex-shrink-0" />
          <span>उत्तर दिया ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-stone-200 border border-stone-300 flex-shrink-0" />
          <span>छोड़ा गया ({unattemptedCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-600 border border-purple-700 flex-shrink-0" />
          <span>समीक्षा हेतु ({reviewCount})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600 flex-shrink-0" />
          <span>उत्तर व समीक्षा ({answeredAndReviewCount})</span>
        </div>
      </div>

      {/* Grid of question numbers */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 gap-1.5 overflow-y-auto max-h-60 sm:max-h-72 p-1">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const qId = idx + 1;
          const isAnswered = answers[qId] !== undefined;
          const isMarked = markedForReview[qId] === true;
          const isCurrent = currentQuestionIndex === idx;

          let btnColor = 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200';

          if (isAnswered && isMarked) {
            btnColor = 'bg-amber-500 text-white border-amber-600 font-bold';
          } else if (isAnswered) {
            btnColor = 'bg-emerald-600 text-white border-emerald-700 font-bold';
          } else if (isMarked) {
            btnColor = 'bg-purple-600 text-white border-purple-700 font-bold';
          }

          return (
            <button
              key={qId}
              onClick={() => onSelectQuestion(idx)}
              className={`h-9 rounded-lg border text-xs flex items-center justify-center transition relative ${btnColor} ${
                isCurrent ? 'ring-2 ring-blue-600 ring-offset-1 font-extrabold shadow-md scale-105 z-10' : ''
              }`}
            >
              {qId}
              {isMarked && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-700 border border-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
