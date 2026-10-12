import React from 'react';
import { X, CheckCircle, FileText, Info } from 'lucide-react';
import { OptionKey } from '../types/exam';

interface OmrSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalQuestions: number;
  answers: Record<number, OptionKey>;
  onSelectOption: (questionId: number, option: OptionKey) => void;
  onClearOption: (questionId: number) => void;
}

export const OmrSheetModal: React.FC<OmrSheetModalProps> = ({
  isOpen,
  onClose,
  totalQuestions,
  answers,
  onSelectOption,
  onClearOption,
}) => {
  if (!isOpen) return null;

  const options: OptionKey[] = ['A', 'B', 'C', 'D'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-stone-50 rounded-2xl max-w-3xl w-full shadow-2xl border-2 border-stone-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header - Official OMR style */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-stone-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center font-bold text-amber-300 text-sm">
              OMR
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base font-heading text-white">
                वस्तुनिष्ठ ओएमआर उत्तर पत्रक (Objective OMR Sheet)
              </h3>
              <p className="text-[11px] text-blue-200">
                बिहार विद्यालय परीक्षा समिति - नीले/काले बॉलपेन से वृत्त भरें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions banner */}
        <div className="bg-amber-100/70 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>गोले (A, B, C, D) को स्पर्श करके उत्तर अंकित करें या बदलें।</span>
          </div>
          <span className="font-bold text-amber-950">
            कुल भरे गए: {Object.keys(answers).length} / {totalQuestions}
          </span>
        </div>

        {/* OMR Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2.5">
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              const qId = idx + 1;
              const selected = answers[qId];

              return (
                <div
                  key={qId}
                  className={`flex items-center justify-between p-2 rounded-lg border transition ${
                    selected
                      ? 'border-blue-300 bg-blue-50/40'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-7 text-xs font-bold text-stone-700 font-mono">
                      Q.{String(qId).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {options.map((opt) => {
                      const isFilled = selected === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => {
                            if (isFilled) {
                              onClearOption(qId);
                            } else {
                              onSelectOption(qId, opt);
                            }
                          }}
                          className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition active:scale-90 ${
                            isFilled
                              ? 'bg-blue-900 text-white shadow-md ring-2 ring-blue-500 scale-105'
                              : 'border-2 border-stone-400 text-stone-600 hover:border-blue-700 hover:text-blue-900'
                          }`}
                          title={`विकल्प ${opt} चुनें`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-100 border-t border-stone-200 px-5 py-3 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            टिप्पणी: भरे गए उत्तर स्वतः सुरक्षित हो जाते हैं।
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-800 text-white rounded-lg shadow transition"
          >
            वापस प्रश्न पत्र पर जाएं (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
