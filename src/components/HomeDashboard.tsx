import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Play,
  Clock,
  Award,
  BookOpen,
  Sparkles,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  User,
  ShieldCheck,
  Mail,
  Atom,
  FlaskConical,
  Dna,
  Calculator,
  Globe2,
  Languages,
  Flame,
  Printer,
  Zap,
} from 'lucide-react';
import { ExamPaper, CandidateInfo } from '../types/exam';
import { SAMPLE_EXAMS } from '../data/sampleExams';
import { NCERT_SUBJECTS } from '../data/ncertBooks';

import { Bell } from 'lucide-react';

interface HomeDashboardProps {
  candidate: CandidateInfo;
  onEditCandidate: () => void;
  onSelectExam: (exam: ExamPaper) => void;
  onOpenUpload: () => void;
  onOpenHelp: () => void;
  onEmailExamPaper: (exam: ExamPaper) => void;
  onOpenBooks?: (subjectId?: string) => void;
  onOpenMistakes?: () => void;
  onOpenFormulas?: () => void;
  onOpenPrintOmr?: () => void;
  onOpenDailyChallenge?: () => void;
  mistakeCount?: number;
  currentStreak?: number;
  noticeBanner?: string;
  isNoticeActive?: boolean;
  customExams?: ExamPaper[];
}

type SubjectCategory = 'ALL' | 'PYQ' | 'SCIENCE' | 'PHYSICS' | 'CHEMISTRY' | 'BIOLOGY' | 'MATH' | 'SST' | 'HINDI' | 'URDU' | 'SANSKRIT';

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  candidate,
  onEditCandidate,
  onSelectExam,
  onOpenUpload,
  onOpenHelp,
  onEmailExamPaper,
  onOpenBooks,
  onOpenMistakes,
  onOpenFormulas,
  onOpenPrintOmr,
  onOpenDailyChallenge,
  mistakeCount = 0,
  currentStreak = 1,
  noticeBanner,
  isNoticeActive = true,
  customExams = [],
}) => {
  const [selectedCategory, setSelectedCategory] = useState<SubjectCategory>('ALL');

  const allAvailableExams = [...customExams, ...SAMPLE_EXAMS];

  const filteredExams = allAvailableExams.filter((exam) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'PYQ') {
      return exam.id.includes('pyq') || exam.subject.includes('PYQ');
    }
    if (selectedCategory === 'SCIENCE') {
      return (
        exam.id === 'bseb-physics-2025' ||
        exam.id === 'bseb-chemistry-2025' ||
        exam.id === 'bseb-biology-2025'
      );
    }
    if (selectedCategory === 'PHYSICS') return exam.id === 'bseb-physics-2025';
    if (selectedCategory === 'CHEMISTRY') return exam.id === 'bseb-chemistry-2025';
    if (selectedCategory === 'BIOLOGY') return exam.id === 'bseb-biology-2025';
    if (selectedCategory === 'MATH') return exam.id === 'bseb-math-2025';
    if (selectedCategory === 'SST') return exam.id === 'bseb-social-science-2025';
    if (selectedCategory === 'HINDI') return exam.id === 'bseb-hindi-2025';
    if (selectedCategory === 'URDU') return exam.id === 'bseb-urdu-2025';
    if (selectedCategory === 'SANSKRIT') return exam.id === 'bseb-sanskrit-2025';
    return true;
  });

  const getSubjectBadge = (id: string) => {
    if (id.includes('pyq')) {
      return {
        label: '⭐ बिहार बोर्ड PYQ (2024)',
        color: 'bg-amber-100 text-amber-950 border-amber-300 font-bold',
        icon: <Sparkles className="w-3.5 h-3.5 text-amber-600" />,
      };
    }
    if (id.includes('physics')) {
      return {
        label: 'भौतिक विज्ञान (Physics)',
        color: 'bg-blue-100 text-blue-900 border-blue-200',
        icon: <Atom className="w-3.5 h-3.5 text-blue-700" />,
      };
    }
    if (id.includes('chemistry')) {
      return {
        label: 'रसायन विज्ञान (Chemistry)',
        color: 'bg-purple-100 text-purple-900 border-purple-200',
        icon: <FlaskConical className="w-3.5 h-3.5 text-purple-700" />,
      };
    }
    if (id.includes('biology')) {
      return {
        label: 'जीव विज्ञान (Biology)',
        color: 'bg-emerald-100 text-emerald-900 border-emerald-200',
        icon: <Dna className="w-3.5 h-3.5 text-emerald-700" />,
      };
    }
    if (id.includes('math')) {
      return {
        label: 'गणित (Mathematics)',
        color: 'bg-indigo-100 text-indigo-900 border-indigo-200',
        icon: <Calculator className="w-3.5 h-3.5 text-indigo-700" />,
      };
    }
    if (id.includes('social') || id.includes('sst')) {
      return {
        label: 'सामाजिक विज्ञान (SST)',
        color: 'bg-amber-100 text-amber-900 border-amber-200',
        icon: <Globe2 className="w-3.5 h-3.5 text-amber-700" />,
      };
    }
    if (id.includes('urdu')) {
      return {
        label: 'उर्दू (Urdu - दरक्षां)',
        color: 'bg-teal-100 text-teal-900 border-teal-200',
        icon: <Languages className="w-3.5 h-3.5 text-teal-700" />,
      };
    }
    if (id.includes('sanskrit')) {
      return {
        label: 'संस्कृत (Sanskrit)',
        color: 'bg-orange-100 text-orange-900 border-orange-200',
        icon: <BookOpen className="w-3.5 h-3.5 text-orange-700" />,
      };
    }
    return {
      label: 'हिन्दी (Hindi)',
      color: 'bg-rose-100 text-rose-900 border-rose-200',
      icon: <BookOpen className="w-3.5 h-3.5 text-rose-700" />,
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Admin Notice Banner if active */}
      {isNoticeActive && noticeBanner && (
        <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 border-2 border-amber-500/60 rounded-2xl p-3 sm:p-4 flex items-center gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-amber-950 flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <span className="font-extrabold text-amber-900 mr-2 bg-amber-200/80 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
              BSEB आधिकारिक सूचना
            </span>
            <span className="font-bold text-stone-900 leading-relaxed">
              {noticeBanner}
            </span>
          </div>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-red-950 text-white shadow-xl border-2 border-amber-600/40 p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/40 px-3 py-1 rounded-full text-xs font-semibold text-amber-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>बिहार विद्यालय परीक्षा समिति (BSEB) ऑनलाइन पोर्टल 2025-26</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white leading-tight">
            मैट्रिक कक्षा 10वीं ऑनलाइन परीक्षा व ओएमआर मूल्यांकन
          </h2>

          <p className="mt-3 text-sm sm:text-base text-amber-100/90 leading-relaxed">
            सभी विषयों की परीक्षा दें: विज्ञान में <strong>भौतिकी</strong>, <strong>रसायनशास्त्र</strong> व <strong>जीवविज्ञान</strong> अलग-अलग, तथा <strong>गणित</strong>, <strong>सामाजिक विज्ञान (SST)</strong>, <strong>हिन्दी</strong>, <strong>उर्दू</strong> व <strong>संस्कृत</strong>। PDF अपलोड करें या सीधे मॉडल पेपर शुरू करें।
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-5 py-3 rounded-2xl shadow-lg transition transform active:scale-95 text-sm sm:text-base"
            >
              <Upload className="w-5 h-5 text-amber-950" />
              <span>प्रश्न पत्र PDF अपलोड करें</span>
            </button>

            {onOpenBooks && (
              <button
                onClick={() => onOpenBooks()}
                className="flex items-center gap-2 bg-stone-950 hover:bg-black border border-amber-400/80 text-amber-300 font-bold px-5 py-3 rounded-2xl shadow-lg transition transform active:scale-95 text-sm sm:text-base"
                title="NCERT कक्षा 10वीं की सभी किताबें पढ़ें"
              >
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>📚 NCERT पुस्तकें पढ़ें</span>
              </button>
            )}

            <button
              onClick={() => onSelectExam(SAMPLE_EXAMS[0])}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-4 py-3 rounded-2xl transition text-sm"
            >
              <Play className="w-4 h-4 text-amber-300" />
              <span>भौतिकी (Physics) शुरू करें</span>
            </button>

            <button
              onClick={onOpenHelp}
              className="flex items-center gap-1.5 text-xs text-amber-200 hover:text-white px-3 py-2 rounded-xl transition"
            >
              <HelpCircle className="w-4 h-4" />
              <span>गाइड / पब्लिश</span>
            </button>
          </div>
        </div>

        {/* Decorative corner element */}
        <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none hidden md:block">
          <BookOpen className="w-56 h-56 text-white" />
        </div>
      </div>

      {/* Candidate Profile Strip */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">परीक्षार्थी (Student):</span>
              <span className="text-sm font-bold text-stone-900">{candidate.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-600 mt-0.5 font-mono">
              <span>रोल कोड: <strong>{candidate.rollCode}</strong></span>
              <span>•</span>
              <span>रोल नं.: <strong>{candidate.rollNumber}</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={onEditCandidate}
          className="text-xs font-semibold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
        >
          विवरण बदलें (Edit Profile)
        </button>
      </div>

      {/* 4 Super Learning Tools For Students Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Tool 1: Daily 10-Minute Challenge & Streak */}
        <div
          onClick={onOpenDailyChallenge}
          className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl border-2 border-orange-300 hover:border-orange-500 p-4 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-orange-500 text-white rounded-xl shadow-xs group-hover:scale-105 transition">
                <Flame className="w-5 h-5" />
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-orange-200 text-orange-950 border border-orange-300">
                🔥 {currentStreak} दिन की स्ट्रीक
              </span>
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm group-hover:text-orange-900 transition">
                दैनिक 10-मिनट रैपिड टेस्ट
              </h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                रोज़ाना 10 महत्वपूर्ण प्रश्नों का अभ्यास करें और अपनी स्ट्रीक आगे बढ़ाएं।
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-orange-200/60 flex items-center justify-between text-xs font-bold text-orange-800">
            <span>अभी टेस्ट दें →</span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-orange-200">10 मिनट</span>
          </div>
        </div>

        {/* Tool 2: Mistakes Diary (ग़लतियों की डायरी & Re-Test) */}
        <div
          onClick={onOpenMistakes}
          className="bg-gradient-to-br from-rose-50 via-red-50 to-pink-50 rounded-2xl border-2 border-rose-300 hover:border-rose-500 p-4 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-rose-600 text-white rounded-xl shadow-xs group-hover:scale-105 transition">
                <AlertCircle className="w-5 h-5" />
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-rose-200 text-rose-950 border border-rose-300">
                {mistakeCount} गलत प्रश्न
              </span>
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm group-hover:text-rose-900 transition">
                ग़लतियों की डायरी (Re-Test)
              </h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                गलत हुए प्रश्नों का सीधा NCERT हल देखें और सिर्फ उन्हीं का री-टेस्ट दें।
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-rose-200/60 flex items-center justify-between text-xs font-bold text-rose-800">
            <span>कमजोरी सुधारें →</span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-rose-200">री-टेस्ट मोड</span>
          </div>
        </div>

        {/* Tool 3: 1-Click Formula & Key Concept Sheet */}
        <div
          onClick={onOpenFormulas}
          className="bg-gradient-to-br from-amber-50 via-yellow-50 to-stone-50 rounded-2xl border-2 border-amber-300 hover:border-amber-500 p-4 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-amber-600 text-white rounded-xl shadow-xs group-hover:scale-105 transition">
                <Zap className="w-5 h-5" />
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-300">
                Class 10 VVI
              </span>
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm group-hover:text-amber-900 transition">
                1-क्लिक सूत्र एवं तथ्य चार्ट
              </h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                भौतिकी, रसायन, गणित व साहित्य के सभी प्रमुख सूत्र एक जगह ऑडियो सहित।
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs font-bold text-amber-800">
            <span>सूत्र चार्ट खोलें →</span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-amber-200">ऑडियो सहित 🔊</span>
          </div>
        </div>

        {/* Tool 4: Printable Real BSEB OMR Sheet */}
        <div
          onClick={onOpenPrintOmr}
          className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 rounded-2xl border-2 border-emerald-300 hover:border-emerald-500 p-4 shadow-xs hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs group-hover:scale-105 transition">
                <Printer className="w-5 h-5" />
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 border border-emerald-300">
                A4 प्रिंट
              </span>
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm group-hover:text-emerald-900 transition">
                असली OMR शीट प्रिंट (BSEB)
              </h4>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                घर पर पेन से गोला भरने का असली अभ्यास करने हेतु 100 प्रश्नों की OMR शीट।
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs font-bold text-emerald-800">
            <span>प्रिंट OMR शीट →</span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-emerald-200">100 प्रश्न</span>
          </div>
        </div>
      </div>

      {/* BSEB Matric Official Sample Papers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-stone-900">
              बिहार बोर्ड मैट्रिक सभी विषय मॉडल पेपर एवं पिछले वर्ष के पेपर (PYQ)
            </h3>
            <p className="text-xs text-stone-600">
              विषय चुनकर तुरंत परीक्षा दें। प्रत्येक पेपर में वास्तविक 20 वस्तुनिष्ठ प्रश्न, टाइमर व OMR शीट उपलब्ध है:
            </p>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl transition flex-shrink-0 cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            सभी विषय ({allAvailableExams.length})
          </button>

          <button
            onClick={() => setSelectedCategory('PYQ')}
            className={`px-3 py-1.5 rounded-xl transition flex-shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'PYQ'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md ring-2 ring-amber-300 font-bold'
                : 'bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>⭐ पिछले वर्ष के पेपर्स (PYQ 2024)</span>
          </button>

          <button
            onClick={() => setSelectedCategory('SCIENCE')}
            className={`px-3 py-1.5 rounded-xl transition flex-shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'SCIENCE'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-blue-900 hover:bg-blue-50'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>विज्ञान (Physics, Chemistry, Biology)</span>
          </button>

          <button
            onClick={() => setSelectedCategory('MATH')}
            className={`px-3 py-1.5 rounded-xl transition flex-shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'MATH'
                ? 'bg-indigo-800 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-indigo-900 hover:bg-indigo-50'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>गणित (Math)</span>
          </button>

          <button
            onClick={() => setSelectedCategory('SST')}
            className={`px-3 py-1.5 rounded-xl transition flex-shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'SST'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-amber-900 hover:bg-amber-50'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>सामाजिक विज्ञान (SST)</span>
          </button>

          <button
            onClick={() => setSelectedCategory('HINDI')}
            className={`px-3 py-1.5 rounded-xl transition flex-shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'HINDI'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-rose-900 hover:bg-rose-50'
            }`}
          >
            <span>हिन्दी (Hindi)</span>
          </button>

          <button
            onClick={() => setSelectedCategory('URDU')}
            className={`px-3 py-1.5 rounded-xl transition flex-shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'URDU'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-teal-900 hover:bg-teal-50'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>उर्दू (Urdu - درخشاں)</span>
          </button>

          <button
            onClick={() => setSelectedCategory('SANSKRIT')}
            className={`px-3 py-1.5 rounded-xl transition flex-shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'SANSKRIT'
                ? 'bg-orange-700 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-orange-900 hover:bg-orange-50'
            }`}
          >
            <span>संस्कृत (Sanskrit)</span>
          </button>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredExams.map((exam) => {
            const badge = getSubjectBadge(exam.id);

            return (
              <div
                key={exam.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md hover:border-amber-400 transition p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      कोड: {exam.subjectCode}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {exam.suggestedTimeMinutes} मिनट
                    </span>
                  </div>

                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold border mb-2 ${badge.color}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </div>

                  <h4 className="text-base font-bold text-stone-900 font-heading">
                    {exam.subject}
                  </h4>

                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                    {exam.examTitle}
                  </p>

                  <div className="mt-3 py-2 border-t border-b border-stone-100 text-xs text-stone-500 space-y-1">
                    <div className="flex justify-between">
                      <span>वस्तुनिष्ठ प्रश्न:</span>
                      <strong className="text-stone-800 font-mono">{exam.questions.length} प्रश्न</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>कुल पूर्णांक:</span>
                      <strong className="text-stone-800 font-mono">{exam.totalMarks} अंक</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>परीक्षा भाषा:</span>
                      <span className="text-stone-800 font-medium">
                        {exam.id.includes('urdu') ? 'उर्दू (رسم الخط)' : exam.id.includes('sanskrit') ? 'संस्कृत व हिन्दी' : 'हिन्दी (Devanagari)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 grid grid-cols-5 gap-1.5">
                  <button
                    onClick={() => onSelectExam(exam)}
                    className="col-span-4 flex items-center justify-center gap-1.5 bg-amber-800 hover:bg-amber-900 text-white font-bold py-2 rounded-xl text-xs shadow transition active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>परीक्षा शुरू करें</span>
                  </button>
                  <button
                    onClick={() => onEmailExamPaper(exam)}
                    className="col-span-1 flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-red-700 py-2 rounded-xl text-xs border border-stone-200 transition"
                    title="प्रश्न पत्र जीमेल पर भेजें"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NCERT Class 10 e-Books Library Section */}
      <div className="bg-white rounded-3xl border-2 border-amber-500/30 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                आधिकारिक ई-पुस्तकालय
              </span>
              <span className="text-xs text-stone-500 hidden sm:inline">• BSEB & NCERT अनुमोदित</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-heading text-stone-900 mt-1">
              📚 NCERT कक्षा 10वीं ई-पुस्तकालय (Class 10 Textbooks)
            </h3>
            <p className="text-xs text-stone-600">
              परीक्षार्थी यहाँ सभी विषयों की मूल पुस्तकें पढ़ सकते हैं। परीक्षा में गलत उत्तर आने पर आप सीधे इन्हीं किताबों में हाइलाइटेड उत्तर देख सकते हैं।
            </p>
          </div>

          {onOpenBooks && (
            <button
              onClick={() => onOpenBooks()}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>पूरी लाइब्रेरी खोलें</span>
            </button>
          )}
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {NCERT_SUBJECTS.map((sub) => {
            return (
              <div
                key={sub.id}
                className="bg-stone-50 hover:bg-amber-50/40 rounded-2xl border border-stone-200 hover:border-amber-400 p-4 transition shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-amber-950 font-heading">
                      {sub.name}
                    </span>
                    <span className="text-[10px] bg-stone-200/80 text-stone-700 font-bold px-2 py-0.5 rounded-full font-mono">
                      {sub.chapters.length} अध्याय
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 font-medium line-clamp-1 mb-2">
                    {sub.bookName}
                  </p>

                  <div className="text-[11px] text-stone-500 space-y-0.5 bg-white p-2 rounded-xl border border-stone-100 mb-3">
                    <span className="font-semibold text-stone-700 block">मुख्य अध्याय:</span>
                    {sub.chapters.slice(0, 2).map((ch) => (
                      <p key={ch.id} className="truncate">
                        • {ch.chapterTitle}
                      </p>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onOpenBooks && onOpenBooks(sub.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 bg-white hover:bg-amber-800 hover:text-white text-stone-800 font-bold text-xs rounded-xl border border-stone-300 hover:border-amber-800 shadow-2xs transition"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>किताब पढ़ें (Read Book)</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload PDF Section */}
      <div className="bg-gradient-to-r from-stone-900 to-amber-950 rounded-2xl p-5 text-white shadow-md flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Scanned PDF & Camera Photo Support
            </span>
            <span className="text-xs text-amber-200">AI OCR Multi-Subject</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-heading text-white">
            क्या आपके पास किसी अन्य विषय का प्रश्न पत्र या गाइड बुक है?
          </h3>
          <p className="text-xs text-stone-300 max-w-xl">
            भौतिकी, रसायन, जीवविज्ञान, गणित, SST, हिन्दी या उर्दू के किसी भी प्रश्न पत्र की PDF या फोटो अपलोड करें। AI तुरंत उसे ऑनलाइन परीक्षा में बदल देगा।
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-4 py-2.5 rounded-xl shadow transition transform active:scale-95 text-xs sm:text-sm"
        >
          <Upload className="w-4 h-4" />
          <span>अपलोड करें (Upload PDF)</span>
        </button>
      </div>

      {/* Instructions & Guidelines Box */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-3">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>परीक्षार्थियों के लिए मुख्य निर्देश (Important Guidelines)</span>
        </div>
        <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside leading-relaxed">
          <li>परीक्षा प्रारंभ होते ही टाइमर सक्रिय हो जाएगा। निर्धारित समय समाप्त होने पर परीक्षा स्वतः जमा हो जाएगी।</li>
          <li>आप <strong>'एक-एक प्रश्न'</strong> या <strong>'प्रश्न पुस्तिका प्रारूप'</strong> में से किसी भी दृश्य में परीक्षा दे सकते हैं।</li>
          <li>असली बोर्ड परीक्षा की तरह गोले भरने के लिए ऊपर दिए गए <strong>'OMR शीट'</strong> बटन का उपयोग कर सकते हैं।</li>
          <li><strong>परीक्षा समाप्त होने से पहले कोई उत्तर या समाधान नहीं दिखाया जाएगा।</strong></li>
          <li>परीक्षा जमा करने के उपरांत आधिकारिक अंक पत्रक, प्रतिशत, सही/गलत उत्तर व विस्तृत हल प्राप्त होगा, जिसे आप सीधे <strong>Gmail</strong> पर भी भेज सकते हैं।</li>
        </ul>
      </div>
    </div>
  );
};
