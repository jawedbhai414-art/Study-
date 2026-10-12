import React, { useState, useEffect } from 'react';
import { X, AlertCircle, PlayCircle, Trash2, CheckCircle2, BookOpen, Search, Sparkles } from 'lucide-react';
import { getSavedMistakes, removeMistake, clearAllMistakes, createMistakeReTestPaper, SavedMistake } from '../utils/mistakeStore';
import { ExamPaper } from '../types/exam';
import { SpeechButton } from './SpeechButton';

interface MistakeNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartReTest: (examPaper: ExamPaper) => void;
  onOpenNcertBook: (questionText: string, topic?: string, explanation?: string, correctOptionText?: string) => void;
}

export const MistakeNotebookModal: React.FC<MistakeNotebookModalProps> = ({
  isOpen,
  onClose,
  onStartReTest,
  onOpenNcertBook,
}) => {
  const [mistakes, setMistakes] = useState<SavedMistake[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setMistakes(getSavedMistakes());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Extract unique subjects
  const subjects = ['ALL', ...Array.from(new Set(mistakes.map((m) => m.subject)))];

  const filteredMistakes = mistakes.filter((m) => {
    const matchesSub = selectedSubject === 'ALL' || m.subject === selectedSubject;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesSub;
    return (
      matchesSub &&
      (m.questionText.toLowerCase().includes(q) ||
        m.explanation.toLowerCase().includes(q) ||
        (m.topic && m.topic.toLowerCase().includes(q)))
    );
  });

  const handleRemove = (id: string) => {
    const updated = removeMistake(id);
    setMistakes(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('क्या आप सचमुच सभी सेव की गई गलतियों को हटाना चाहते हैं?')) {
      clearAllMistakes();
      setMistakes([]);
    }
  };

  const handleLaunchReTest = () => {
    if (filteredMistakes.length === 0) return;
    const reTestPaper = createMistakeReTestPaper(filteredMistakes);
    onClose();
    onStartReTest(reTestPaper);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-red-600 via-rose-700 to-amber-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
              <AlertCircle className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif tracking-tight">
                  ग़लतियों की डायरी (Mistake Notebook)
                </h2>
                <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full">
                  {mistakes.length} प्रश्न
                </span>
              </div>
              <p className="text-xs text-rose-100">
                आपके द्वारा पिछले टेस्ट में गलत किए गए सभी प्रश्नों का व्यक्तिगत संग्रह और NCERT सुधार
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-200 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            aria-label="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Banner (Re-Test CTA) */}
        {mistakes.length > 0 && (
          <div className="px-6 py-3 bg-amber-50 border-b border-amber-200 flex items-center justify-between flex-wrap gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                इन {filteredMistakes.length} गलत प्रश्नों का दोबारा टेस्ट देकर अपनी तैयारी 100% पक्की करें!
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLaunchReTest}
                disabled={filteredMistakes.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
              >
                <PlayCircle className="w-4 h-4" />
                <span>केवल गलत प्रश्नों का री-टेस्ट दें ({filteredMistakes.length})</span>
              </button>
              <button
                onClick={handleClearAll}
                className="text-xs text-rose-700 hover:text-rose-900 font-semibold px-2 py-1.5 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                title="सभी साफ करें"
              >
                <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                खाली करें
              </button>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 bg-stone-50 border-b border-stone-200 space-y-2.5 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="गलत हुए किसी भी प्रश्न या विषय में खोजें..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
            />
          </div>

          {subjects.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {subjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedSubject === sub
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
                  }`}
                >
                  {sub === 'ALL' ? 'सभी विषय' : sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mistakes List */}
        <div className="p-6 overflow-y-auto space-y-4 grow bg-stone-100/50">
          {filteredMistakes.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500 space-y-3">
              <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-500" />
              <h3 className="text-lg font-bold text-stone-800">
                {mistakes.length === 0
                  ? 'शाबाश! आपकी ग़लतियों की डायरी पूरी तरह खाली है।'
                  : 'इस विषय में कोई गलत प्रश्न नहीं मिला।'}
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                जब आप कोई परीक्षा देते हैं और किसी प्रश्न का गलत विकल्प चुनते हैं, तो वह स्वतः यहाँ दर्ज हो जाता है ताकि आप बाद में उसका पुनरभ्यास कर सकें।
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMistakes.map((m, idx) => {
                const optIndex = ['A', 'B', 'C', 'D'].indexOf(m.correctOption);
                const correctText = optIndex !== -1 ? m.options[optIndex] : '';

                return (
                  <div
                    key={m.id}
                    className="bg-white rounded-2xl border-2 border-rose-200 hover:border-rose-400 p-5 shadow-sm space-y-3.5 transition"
                  >
                    {/* Top bar with subject & remove */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                          #{idx + 1} • {m.subject}
                        </span>
                        {m.topic && (
                          <span className="text-xs text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                            अध्याय: {m.topic}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleRemove(m.id)}
                        className="text-stone-400 hover:text-emerald-700 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-50 px-2 py-1 rounded-lg transition cursor-pointer"
                        title="सीख लिया? सूची से हटाएं"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>सुधार लिया</span>
                      </button>
                    </div>

                    {/* Question Text */}
                    <div className="text-sm font-bold text-stone-900 leading-snug">
                      {m.questionNumber}: {m.questionText}
                    </div>

                    {/* Student Choice vs Correct Choice */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-red-50/80 rounded-xl border border-red-200 text-red-900 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                          ✕
                        </span>
                        <div>
                          <span className="text-[10px] text-red-600 font-bold uppercase block">
                            आपने चुना था:
                          </span>
                          <span className="font-semibold">
                            विकल्प ({m.studentOption || 'छोड़ दिया'})
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-emerald-950 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                          ✓
                        </span>
                        <div>
                          <span className="text-[10px] text-emerald-700 font-bold uppercase block">
                            सही उत्तर:
                          </span>
                          <span className="font-semibold">
                            ({m.correctOption}) {correctText}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Explanation */}
                    {m.explanation && (
                      <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700">
                        <span className="font-bold text-stone-900">स्पष्टीकरण: </span>
                        {m.explanation}
                      </div>
                    )}

                    {/* Actions: Listen & NCERT Book direct link */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between flex-wrap gap-2">
                      <SpeechButton
                        text={`${m.questionText}. सही उत्तर है: ${correctText}. ${m.explanation}`}
                        label="उत्तर सुनें"
                        size="sm"
                      />

                      <button
                        onClick={() =>
                          onOpenNcertBook(
                            m.questionText,
                            m.topic,
                            m.explanation,
                            correctText
                          )
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-xs"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>📖 NCERT किताब में हाइलाइट देखें</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <span>कुल {filteredMistakes.length} गलत प्रश्न सुधार के लिए सूचीबद्ध हैं।</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xl transition cursor-pointer"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
