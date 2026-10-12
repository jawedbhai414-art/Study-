import React, { useState } from 'react';
import { X, Search, BookOpen, Printer, Sparkles, Copy, Check } from 'lucide-react';
import { FORMULA_DATA, FormulaItem } from '../data/formulaData';
import { SpeechButton } from './SpeechButton';

interface FormulaSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaSheetModal: React.FC<FormulaSheetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'सभी सूत्र एवं तथ्य (All)' },
    { id: 'physics', label: '⚡ भौतिकी (Physics)' },
    { id: 'chemistry', label: '🧪 रसायन (Chemistry)' },
    { id: 'math', label: '📐 गणित (Math)' },
    { id: 'sst', label: '🌍 सामाजिक विज्ञान (SST)' },
    { id: 'language', label: '📖 भाषा (Hindi/Urdu/Sanskrit)' },
  ];

  const filteredItems = FORMULA_DATA.filter((item) => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesTab;
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.formulaOrFact.toLowerCase().includes(q) ||
      item.explanation.toLowerCase().includes(q) ||
      item.categoryTitle.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const handleCopy = (item: FormulaItem) => {
    const textToCopy = `${item.title}\n${item.formulaOrFact}\n${item.explanation}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-amber-600 via-amber-700 to-stone-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif tracking-tight">
                  1-क्लिक सूत्र एवं महत्वपूर्ण तथ्य चार्ट
                </h2>
                <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Class 10 VVI
                </span>
              </div>
              <p className="text-xs text-amber-100">
                मैट्रिक परीक्षा 2025-26 के लिए भौतिकी, रसायन, गणित, सामाजिक विज्ञान व साहित्य के सर्वाधिक पूछे जाने वाले सूत्र
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold border border-white/20 transition cursor-pointer"
              title="A4 शीट पर प्रिंट निकालें"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">प्रिंट करें (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-200 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              aria-label="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="px-6 pt-4 pb-3 bg-stone-50 border-b border-stone-200 space-y-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="किसी भी सूत्र, नियम या वैज्ञानिक नाम से खोजें (उदा: ओम का नियम, pH, त्रिकोणमिति, विरंजक चूर्ण)..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
            />
          </div>

          {/* Tab Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  activeTab === cat.id
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white hover:bg-stone-200/80 text-stone-600 border border-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 grow bg-stone-100/60">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-500">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-stone-400 opacity-50" />
              <p className="font-semibold text-stone-700">कोई सूत्र नहीं मिला</p>
              <p className="text-xs text-stone-500 mt-1">कृपया दूसरा शब्द टाइप करके खोजें।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border-2 border-stone-200 hover:border-amber-400 p-4.5 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    {/* Header badge & title */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                          {item.categoryTitle}
                        </span>
                        <h3 className="font-bold text-stone-900 mt-1 text-base leading-snug">
                          {item.title}
                        </h3>
                      </div>
                      <span className="shrink-0 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                        {item.importanceTag}
                      </span>
                    </div>

                    {/* Formula / Fact Highlight Box */}
                    <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/90 font-mono text-sm sm:text-base font-black text-amber-950 whitespace-pre-line tracking-tight">
                      {item.formulaOrFact}
                    </div>

                    {/* Explanation */}
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {item.explanation}
                    </p>

                    {item.exampleOrNote && (
                      <div className="p-2 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-600 italic">
                        💡 {item.exampleOrNote}
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-3.5 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                    <SpeechButton
                      text={`${item.title}. सूत्र: ${item.formulaOrFact}. व्याख्या: ${item.explanation}`}
                      label="सुनें"
                      size="sm"
                    />

                    <button
                      onClick={() => handleCopy(item)}
                      className="flex items-center gap-1 text-xs text-stone-500 hover:text-amber-700 px-2 py-1 rounded-md hover:bg-stone-100 transition cursor-pointer"
                      title="सूत्र कॉपी करें"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">कॉपी हो गया!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>कॉपी करें</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <span>कुल {filteredItems.length} मुख्य सूत्र एवं अवधारणाएं उपलब्ध हैं।</span>
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
