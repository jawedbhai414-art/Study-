import React from 'react';
import { AlertCircle, CheckCircle2, Bookmark, HelpCircle, X, Send } from 'lucide-react';
import { OptionKey } from '../types/exam';

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  totalQuestions: number;
  answers: Record<number, OptionKey>;
  markedForReview: Record<number, boolean>;
}

export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  totalQuestions,
  answers,
  markedForReview,
}) => {
  if (!isOpen) return null;

  const attemptedCount = Object.keys(answers).length;
  const unattemptedCount = totalQuestions - attemptedCount;
  const reviewCount = Object.values(markedForReview).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-800 to-amber-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base font-heading">
              परीक्षा जमा करने की पुष्टि (Submit Exam)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-stone-800">
          <p className="text-xs text-stone-600">
            क्या आप वाकई परीक्षा समाप्त करना चाहते हैं? कृपया जमा करने से पूर्व अपनी स्थिति की समीक्षा करें:
          </p>

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="block text-xl font-bold text-emerald-700 font-mono">
                {attemptedCount}
              </span>
              <span className="text-[11px] font-semibold text-emerald-900">हल किए गए</span>
            </div>

            <div className="p-2.5 bg-stone-100 border border-stone-300 rounded-xl">
              <span className="block text-xl font-bold text-stone-700 font-mono">
                {unattemptedCount}
              </span>
              <span className="text-[11px] font-semibold text-stone-800">अनुत्तरित</span>
            </div>

            <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl">
              <span className="block text-xl font-bold text-purple-700 font-mono">
                {reviewCount}
              </span>
              <span className="text-[11px] font-semibold text-purple-900">समीक्षा हेतु</span>
            </div>
          </div>

          {unattemptedCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold">सावधानी:</span> आपने अभी तक <strong>{unattemptedCount}</strong> प्रश्नों के उत्तर नहीं दिए हैं। क्या आप अभी भी जमा करना चाहते हैं?
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-[11px] text-blue-900">
            जमा करने के तुरंत बाद आपको आपके <strong>कुल प्राप्तांक, प्रतिशत, सही/गलत उत्तर तथा प्रत्येक प्रश्न की विस्तृत व्याख्या</strong> दिखाई जाएगी।
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-5 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 rounded-lg transition"
          >
            पुनः जाँच करें (Back)
          </button>

          <button
            onClick={onConfirmSubmit}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-red-700 hover:bg-red-800 text-white rounded-lg shadow transition active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>हाँ, परीक्षा जमा करें (Final Submit)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
