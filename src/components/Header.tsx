import React from 'react';
import { BookOpen, User as UserIcon, Sparkles, HelpCircle, FileText, Mail, LogOut, ShieldCheck } from 'lucide-react';
import { User } from 'firebase/auth';
import { CandidateInfo } from '../types/exam';

interface HeaderProps {
  candidate: CandidateInfo;
  onEditCandidate: () => void;
  onOpenHelp: () => void;
  onOpenUpload: () => void;
  onOpenBooks?: () => void;
  onOpenMistakes?: () => void;
  onOpenFormulas?: () => void;
  onOpenPrintOmr?: () => void;
  onOpenDailyChallenge?: () => void;
  mistakeCount?: number;
  currentStreak?: number;
  isExamInProgress: boolean;
  user: User | null;
  onSignInGoogle: () => void;
  onSignOutGoogle: () => void;
  isAdmin: boolean;
  onOpenAdminPanel: () => void;
  onOpenAdminLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  candidate,
  onEditCandidate,
  onOpenHelp,
  onOpenUpload,
  onOpenBooks,
  onOpenMistakes,
  onOpenFormulas,
  onOpenPrintOmr,
  onOpenDailyChallenge,
  mistakeCount = 0,
  currentStreak = 1,
  isExamInProgress,
  user,
  onSignInGoogle,
  onSignOutGoogle,
  isAdmin,
  onOpenAdminPanel,
  onOpenAdminLogin,
}) => {
  return (
    <header className="no-print bg-gradient-to-r from-amber-900 via-amber-800 to-red-900 text-white shadow-md border-b-2 border-amber-600">
      {/* Top Bar with BSEB branding */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          {/* Emblem representation */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500/20 border-2 border-amber-300 flex items-center justify-center shadow-inner flex-shrink-0">
            <span className="text-xl sm:text-2xl font-bold font-heading text-amber-200">बी</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded border border-amber-400/40">
                BSEB Matric 2025-26
              </span>
              <span className="hidden sm:inline text-xs text-amber-200/80">
                हिन्दी माध्यम पोर्टल
              </span>
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white font-heading">
              बिहार विद्यालय परीक्षा समिति, पटना
            </h1>
            <p className="text-[11px] sm:text-xs text-amber-200/90 font-medium -mt-0.5">
              कक्षा 10वीं ऑनलाइन परीक्षा एवं ओएमआर मूल्यांकन पोर्टल
            </p>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Daily Streak & Challenge Button */}
          {onOpenDailyChallenge && !isExamInProgress && (
            <button
              onClick={onOpenDailyChallenge}
              className="flex items-center gap-1.5 text-xs sm:text-sm bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-110 text-white font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition transform active:scale-95 border border-orange-300"
              title="दैनिक 10-मिनट रैपिड टेस्ट एवं स्ट्रीक"
            >
              <span>🔥 {currentStreak}D</span>
              <span className="hidden md:inline">रैपिड 10</span>
            </button>
          )}

          {/* Mistakes Notebook Button */}
          {onOpenMistakes && !isExamInProgress && (
            <button
              onClick={onOpenMistakes}
              className="flex items-center gap-1.5 text-xs sm:text-sm bg-rose-900/80 hover:bg-rose-900 text-rose-200 border border-rose-400/50 font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition transform active:scale-95"
              title="ग़लतियों की डायरी (सुधार एवं री-टेस्ट)"
            >
              <span>📝 गलतियां</span>
              {mistakeCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {mistakeCount}
                </span>
              )}
            </button>
          )}

          {/* Formulas Sheet Button */}
          {onOpenFormulas && !isExamInProgress && (
            <button
              onClick={onOpenFormulas}
              className="flex items-center gap-1 text-xs sm:text-sm bg-stone-900/80 hover:bg-stone-900 text-amber-200 border border-amber-400/40 font-bold px-2.5 py-1.5 rounded-lg shadow-sm transition transform active:scale-95"
              title="1-क्लिक सूत्र एवं महत्वपूर्ण तथ्य चार्ट"
            >
              <span>⚡ सूत्र</span>
            </button>
          )}

          {/* NCERT Books Library Button */}
          {onOpenBooks && !isExamInProgress && (
            <button
              onClick={onOpenBooks}
              className="flex items-center gap-1.5 text-xs sm:text-sm bg-stone-900/80 hover:bg-stone-900 text-amber-300 border border-amber-400/50 font-bold px-3 py-1.5 rounded-lg shadow-sm transition transform active:scale-95"
              title="NCERT कक्षा 10वीं की सभी किताबें पढ़ें"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>📚 NCERT</span>
            </button>
          )}

          {!isExamInProgress && (
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold px-3 py-1.5 rounded-lg shadow transition transform active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>PDF अपलोड करें</span>
            </button>
          )}

          {/* Admin Button */}
          {isAdmin ? (
            <button
              onClick={onOpenAdminPanel}
              className="flex items-center gap-1.5 text-xs sm:text-sm bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 hover:brightness-110 text-amber-950 font-black px-3 py-1.5 rounded-lg shadow-md transition transform active:scale-95 border border-yellow-200"
              title="मुख्य प्रशासक नियंत्रण कक्ष खोलें"
            >
              <ShieldCheck className="w-4 h-4 text-amber-950" />
              <span>👑 एडमिन पैनल</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1 text-xs sm:text-sm bg-black/20 hover:bg-black/30 border border-amber-400/30 text-amber-200 px-2.5 py-1.5 rounded-lg transition"
              title="एडमिन लॉगिन"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">एडमिन</span>
            </button>
          )}

          {/* Google Sign-in / Gmail Status Button */}
          {user ? (
            <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-lg p-0.5 text-xs">
              <div className="flex items-center gap-1.5 px-2 py-1 text-amber-100">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-5 h-5 rounded-full border border-amber-300"
                  />
                ) : (
                  <Mail className="w-4 h-4 text-amber-300" />
                )}
                <span className="hidden md:inline font-medium max-w-[130px] truncate text-white" title={user.email || ''}>
                  {user.email}
                </span>
                <span className="md:hidden font-medium text-white">Gmail</span>
              </div>
              <button
                onClick={onSignOutGoogle}
                className="p-1 hover:bg-white/20 rounded text-amber-200 hover:text-white transition"
                title="Google से साइन आउट करें"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignInGoogle}
              className="flex items-center gap-1.5 text-xs sm:text-sm bg-white hover:bg-stone-100 text-stone-800 font-semibold px-2.5 py-1.5 rounded-lg shadow transition transform active:scale-95 border border-stone-200"
              title="Google / Gmail से साइन इन करें"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Gmail जोड़ें</span>
            </button>
          )}

          <button
            onClick={onEditCandidate}
            className="flex items-center gap-1.5 text-xs sm:text-sm bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1.5 rounded-lg transition"
            title="परीक्षार्थी विवरण बदलें"
          >
            <UserIcon className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline font-medium text-amber-100">
              {candidate.name} ({candidate.rollNumber})
            </span>
            <span className="md:hidden font-medium text-amber-100">रोल: {candidate.rollNumber}</span>
          </button>

          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1 text-xs sm:text-sm bg-amber-950/60 hover:bg-amber-950 border border-amber-500/40 text-amber-200 px-2.5 py-1.5 rounded-lg transition"
            title="चलाने और प्रकाशित करने की विधि"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">गाइड / पब्लिश</span>
          </button>
        </div>
      </div>
    </header>
  );
};
