import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Search,
  CheckCircle2,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Bookmark,
  Share2,
  ExternalLink,
} from 'lucide-react';
import {
  NCERT_SUBJECTS,
  NcertSubject,
  NcertChapter,
  NcertSnippet,
} from '../data/ncertBooks';

interface NcertBookReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSubjectId?: string;
  initialChapterId?: string;
  targetSnippet?: NcertSnippet | null;
  targetQuestionText?: string;
}

export const NcertBookReaderModal: React.FC<NcertBookReaderModalProps> = ({
  isOpen,
  onClose,
  initialSubjectId,
  initialChapterId,
  targetSnippet,
  targetQuestionText,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    initialSubjectId || 'physics'
  );
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    initialChapterId || 'phy-ch10'
  );
  const [activeViewTab, setActiveViewTab] = useState<'HIGHLIGHT' | 'FULL_CHAPTER'>(
    targetSnippet ? 'HIGHLIGHT' : 'FULL_CHAPTER'
  );
  const [textSize, setTextSize] = useState<'NORMAL' | 'LARGE' | 'XLARGE'>('NORMAL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (initialSubjectId) setSelectedSubjectId(initialSubjectId);
    if (initialChapterId) setSelectedChapterId(initialChapterId);
    if (targetSnippet) setActiveViewTab('HIGHLIGHT');
  }, [initialSubjectId, initialChapterId, targetSnippet]);

  if (!isOpen) return null;

  const currentSubject =
    NCERT_SUBJECTS.find((s) => s.id === selectedSubjectId) || NCERT_SUBJECTS[0];
  const currentChapter =
    currentSubject.chapters.find((c) => c.id === selectedChapterId) ||
    currentSubject.chapters[0];

  const fontSizeClass =
    textSize === 'XLARGE'
      ? 'text-lg leading-loose'
      : textSize === 'LARGE'
      ? 'text-base leading-relaxed'
      : 'text-sm leading-relaxed';

  // Intelligent highlighter for answers & search queries
  const renderHighlightedContent = (text: string, highlight?: string) => {
    const activeSearch = searchQuery.trim();
    const effectiveHighlight = activeSearch || highlight;

    if (!effectiveHighlight) return <p className="whitespace-pre-line">{text}</p>;

    // 1. Try exact match first
    try {
      const cleanTerm = effectiveHighlight.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (text.toLowerCase().includes(effectiveHighlight.toLowerCase())) {
        const parts = text.split(new RegExp(`(${cleanTerm})`, 'gi'));
        return (
          <p className="whitespace-pre-line">
            {parts.map((part, index) =>
              part.toLowerCase() === effectiveHighlight.toLowerCase() ? (
                <mark
                  key={index}
                  className="bg-yellow-300 text-stone-950 font-black px-2 py-0.5 rounded-md shadow-sm ring-2 ring-amber-400 mx-0.5 animate-pulse inline-block"
                >
                  {part}
                </mark>
              ) : (
                <span key={index}>{part}</span>
              )
            )}
          </p>
        );
      }

      // 2. Keyword fallback for phrases
      const words = effectiveHighlight
        .split(/\s+/)
        .filter((w) => w.length > 2 && !['किस', 'प्रकार', 'का', 'के', 'की', 'में', 'से', 'होता', 'है', 'को', 'और', 'अथवा', 'यह'].includes(w));

      if (words.length > 0) {
        const pattern = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
        const parts = text.split(pattern);
        return (
          <p className="whitespace-pre-line">
            {parts.map((part, index) =>
              words.some((w) => w.toLowerCase() === part.toLowerCase()) ? (
                <mark
                  key={index}
                  className="bg-yellow-300 text-stone-950 font-bold px-1.5 py-0.5 rounded shadow-2xs ring-1 ring-amber-400 mx-0.5"
                >
                  {part}
                </mark>
              ) : (
                <span key={index}>{part}</span>
              )
            )}
          </p>
        );
      }
    } catch {
      // Fallback in case of regex error
    }

    return <p className="whitespace-pre-line">{text}</p>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-stone-50 rounded-3xl max-w-4xl w-full shadow-2xl border-2 border-amber-600/50 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base font-heading text-white">
                  NCERT / बिहार बोर्ड कक्षा 10वीं ई-पाठ्यपुस्तक (Textbook Reader)
                </h3>
                <span className="text-[10px] bg-amber-400 text-amber-950 font-extrabold px-2 py-0.2 rounded-full uppercase hidden sm:inline">
                  आधिकारिक पुस्तक
                </span>
              </div>
              <p className="text-[11px] text-amber-200/90 truncate max-w-xs sm:max-w-md">
                {currentChapter.bookName} • {currentChapter.chapterTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Text Zoom Controls */}
            <div className="hidden sm:flex items-center bg-stone-800 rounded-lg p-0.5 border border-stone-700 text-xs">
              <button
                onClick={() =>
                  setTextSize(textSize === 'XLARGE' ? 'LARGE' : 'NORMAL')
                }
                className="p-1 hover:text-amber-300"
                title="अक्षर छोटा करें"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() =>
                  setTextSize(textSize === 'NORMAL' ? 'LARGE' : 'XLARGE')
                }
                className="p-1 hover:text-amber-300"
                title="अक्षर बड़ा करें"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subject & Chapter Selector Bar */}
        <div className="bg-stone-200/80 px-4 py-2 border-b border-stone-300 flex items-center justify-between flex-wrap gap-2 text-xs">
          {/* Subject Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {NCERT_SUBJECTS.map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubjectId(sub.id);
                  setSelectedChapterId(sub.chapters[0]?.id || '');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold transition flex-shrink-0 ${
                  selectedSubjectId === sub.id
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-300'
                }`}
              >
                {sub.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Chapters Dropdown */}
          <div className="flex items-center gap-1">
            <span className="font-semibold text-stone-600">अध्याय:</span>
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-600"
            >
              {currentSubject.chapters.map((chap) => (
                <option key={chap.id} value={chap.id}>
                  अध्याय {chap.chapterNumber}: {chap.chapterTitle}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Tabs (Direct Answer Highlight vs Full Chapter) */}
        <div className="bg-white px-4 border-b border-stone-200 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            {targetSnippet && (
              <button
                onClick={() => setActiveViewTab('HIGHLIGHT')}
                className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
                  activeViewTab === 'HIGHLIGHT'
                    ? 'border-amber-700 text-amber-900 font-extrabold'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>पुस्तक में प्रश्न का उत्तर (Highlighted Answer)</span>
              </button>
            )}

            <button
              onClick={() => setActiveViewTab('FULL_CHAPTER')}
              className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
                activeViewTab === 'FULL_CHAPTER'
                  ? 'border-amber-700 text-amber-900 font-extrabold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>पूरा अध्याय पढ़ें (Full Chapter)</span>
            </button>
          </div>

          {targetSnippet && (
            <span className="text-[11px] font-semibold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 hidden md:inline">
              पृष्ठ सं. {targetSnippet.pageNumber} पर उपलब्ध
            </span>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-white">
          {/* MODE 1: TARGET SNIPPET HIGHLIGHT */}
          {activeViewTab === 'HIGHLIGHT' && targetSnippet ? (
            <div className="space-y-4 max-w-3xl mx-auto">
              {/* Question Reference Box */}
              {targetQuestionText && (
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    संबंधित प्रश्न (Question Asked):
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                    {targetQuestionText}
                  </h4>
                </div>
              )}

              {/* Direct Highlighted Answer Card */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50/50 border-2 border-amber-400 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>NCERT पाठ्यपुस्तक का प्रामाणिक उत्तर (Direct Highlight)</span>
                  </div>
                  <span className="text-[11px] bg-white border border-amber-300 px-2 py-0.5 rounded-md font-mono font-bold text-amber-950">
                    NCERT पृष्ठ {targetSnippet.pageNumber}
                  </span>
                </div>

                {/* The highlighted answer */}
                <div className="p-3.5 bg-yellow-100/80 border-l-4 border-yellow-500 rounded-r-xl shadow-xs">
                  <p className="text-sm sm:text-base font-bold text-stone-950 leading-relaxed">
                    ✨ {targetSnippet.highlightedAnswer}
                  </p>
                </div>

                {/* Surrounding Context from the Book */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-stone-700 block mb-1">
                    पुस्तक का संबंधित अनुच्छेद (Context from Textbook):
                  </span>
                  <div className={`text-stone-800 ${fontSizeClass} bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs`}>
                    {renderHighlightedContent(
                      targetSnippet.bookExcerpt,
                      targetSnippet.highlightedAnswer
                    )}
                  </div>
                </div>
              </div>

              {/* Read Full Chapter CTA */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <span className="text-xs text-stone-600">
                  इस विषय को और गहराई से समझना चाहते हैं?
                </span>
                <button
                  onClick={() => setActiveViewTab('FULL_CHAPTER')}
                  className="flex items-center gap-1 text-xs font-bold text-amber-900 hover:underline"
                >
                  <span>पूरा अध्याय पढ़ें</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* MODE 2: FULL CHAPTER READING */
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="border-b border-stone-200 pb-3 text-center">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  {currentSubject.name} • अध्याय {currentChapter.chapterNumber}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-stone-900 mt-2">
                  {currentChapter.chapterTitle}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  बिहार विद्यालय परीक्षा समिति एवं NCERT द्वारा अनुमोदित मूल पाठ
                </p>

                {/* Chapter Keyword Search Input */}
                <div className="mt-3 max-w-md mx-auto flex items-center bg-stone-100 border border-stone-300 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-amber-500 focus-within:bg-white transition">
                  <Search className="w-4 h-4 text-stone-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="अध्याय में शब्द या टॉपिक खोजें (जैसे: दर्पण, pH, नेफ्रॉन)..."
                    className="w-full bg-transparent text-xs text-stone-800 placeholder-stone-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-stone-400 hover:text-stone-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Chapter Body */}
              <div className={`p-4 sm:p-6 bg-white border border-stone-200 rounded-2xl shadow-xs text-stone-900 ${fontSizeClass}`}>
                {renderHighlightedContent(
                  currentChapter.fullChapterText,
                  targetSnippet?.highlightedAnswer
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-100 border-t border-stone-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-stone-600">
          <span>
            स्रोत: <strong>{currentChapter.bookName}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-lg shadow-xs transition"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
