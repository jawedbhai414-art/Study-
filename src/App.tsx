import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { ExamScreen } from './components/ExamScreen';
import { ResultView } from './components/ResultView';
import { UploadModal } from './components/UploadModal';
import { CandidateModal } from './components/CandidateModal';
import { PublishGuideModal } from './components/PublishGuideModal';
import { GmailSendModal } from './components/GmailSendModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { NcertBookReaderModal } from './components/NcertBookReaderModal';
import { MistakeNotebookModal } from './components/MistakeNotebookModal';
import { FormulaSheetModal } from './components/FormulaSheetModal';
import { PrintableOmrModal } from './components/PrintableOmrModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { getSavedMistakes } from './utils/mistakeStore';
import { getStreakData } from './utils/streakStore';
import { ExamPaper, ExamResult, CandidateInfo, OptionKey } from './types/exam';
import { SAMPLE_EXAMS } from './data/sampleExams';
import {
  NCERT_SUBJECTS,
  findNcertSnippetForQuestion,
  NcertSnippet,
} from './data/ncertBooks';
import { initAuth, googleSignIn, logout } from './services/firebaseAuth';
import {
  isUserAdmin,
  getAdminConfig,
  getAdminCustomExams,
  recordStudentSubmission,
} from './services/adminService';

export default function App() {
  const [candidate, setCandidate] = useState<CandidateInfo>({
    name: 'राहुल कुमार (Rahul Kumar)',
    rollCode: '31042',
    rollNumber: '2500123',
    registrationNumber: '31042-00123-25',
    schoolName: 'राजकीय उच्च माध्यमिक विद्यालय, पटना (BSEB)',
  });

  const [currentExam, setCurrentExam] = useState<ExamPaper | null>(null);
  const [examState, setExamState] = useState<'DASHBOARD' | 'IN_EXAM' | 'RESULT'>('DASHBOARD');
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Admin Config and Custom Exams
  const [adminConfig, setAdminConfig] = useState(getAdminConfig());
  const [adminCustomExams, setAdminCustomExams] = useState<ExamPaper[]>(getAdminCustomExams());

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // Gmail Send Modal State
  const [isGmailSendOpen, setIsGmailSendOpen] = useState<boolean>(false);
  const [gmailSendMode, setGmailSendMode] = useState<'RESULT' | 'QUESTION_PAPER'>('RESULT');
  const [examToEmail, setExamToEmail] = useState<ExamPaper | null>(null);

  // Admin Modals State
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);

  // NCERT Book Reader Modal State
  const [isNcertReaderOpen, setIsNcertReaderOpen] = useState<boolean>(false);
  const [ncertSubjectId, setNcertSubjectId] = useState<string>('physics');
  const [ncertChapterId, setNcertChapterId] = useState<string>('phy-ch10');
  const [ncertTargetSnippet, setNcertTargetSnippet] = useState<NcertSnippet | null>(null);
  const [ncertTargetQuestionText, setNcertTargetQuestionText] = useState<string | undefined>(undefined);

  // Student Super Tools Modals & Stats State
  const [isMistakeNotebookOpen, setIsMistakeNotebookOpen] = useState<boolean>(false);
  const [isFormulaSheetOpen, setIsFormulaSheetOpen] = useState<boolean>(false);
  const [isPrintableOmrOpen, setIsPrintableOmrOpen] = useState<boolean>(false);
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState<boolean>(false);
  const [mistakeCount, setMistakeCount] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(1);

  useEffect(() => {
    setMistakeCount(getSavedMistakes().length);
    setCurrentStreak(getStreakData().currentStreak);
  }, [examState, isMistakeNotebookOpen, isDailyChallengeOpen]);

  useEffect(() => {
    const unsubscribe = initAuth(
      (authUser) => {
        setUser(authUser);
        setIsAdmin(isUserAdmin(authUser));
        if (authUser.displayName && candidate.name === 'राहुल कुमार (Rahul Kumar)') {
          setCandidate((prev) => ({
            ...prev,
            name: authUser.displayName || prev.name,
          }));
        }
      },
      () => {
        setUser(null);
        setIsAdmin(isUserAdmin(null));
      }
    );

    // Initial admin check (e.g. from unlocked session PIN)
    setIsAdmin(isUserAdmin(null));

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignInGoogle = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setIsAdmin(isUserAdmin(res.user));
        if (res.user.displayName) {
          setCandidate((prev) => ({
            ...prev,
            name: res.user.displayName || prev.name,
          }));
        }
      }
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
    }
  };

  const handleSignOutGoogle = async () => {
    try {
      await logout();
      setUser(null);
      setIsAdmin(isUserAdmin(null));
    } catch (err: any) {
      console.error('Sign-out failed:', err);
    }
  };

  const handleRefreshExams = () => {
    setAdminCustomExams(getAdminCustomExams());
    setAdminConfig(getAdminConfig());
  };

  const handleStartExam = (exam: ExamPaper) => {
    setCurrentExam(exam);
    setExamResult(null);
    setExamState('IN_EXAM');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitExam = (
    answers: Record<number, OptionKey>,
    markedForReview: Record<number, boolean>
  ) => {
    if (!currentExam) return;

    let correctCount = 0;
    let wrongCount = 0;
    let marksObtained = 0;

    currentExam.questions.forEach((q) => {
      const userChoice = answers[q.id];
      if (userChoice !== undefined) {
        if (userChoice === q.correctOption) {
          correctCount++;
          marksObtained += q.marks;
        } else {
          wrongCount++;
        }
      }
    });

    const totalQuestions = currentExam.questions.length;
    const attemptedCount = Object.keys(answers).length;
    const unansweredCount = totalQuestions - attemptedCount;
    const totalMarks = currentExam.totalMarks || totalQuestions;
    const percentage = totalMarks > 0 ? (marksObtained / totalMarks) * 100 : 0;

    let division: ExamResult['division'] = 'अनुत्तीर्ण (Fail)';
    if (percentage >= 60) {
      division = 'प्रथम श्रेणी (1st Division)';
    } else if (percentage >= 45) {
      division = 'द्वितीय श्रेणी (2nd Division)';
    } else if (percentage >= 30) {
      division = 'तृतीय श्रेणी (3rd Division)';
    }

    const calculatedResult: ExamResult = {
      totalQuestions,
      attemptedCount,
      correctCount,
      wrongCount,
      unansweredCount,
      marksObtained,
      totalMarks,
      percentage,
      division,
      timeTakenSeconds: 0,
      answers,
      markedForReview,
    };

    // Record submission into Admin database log
    recordStudentSubmission({
      id: `sub-${Date.now()}`,
      candidateName: candidate.name,
      rollCode: candidate.rollCode,
      rollNumber: candidate.rollNumber,
      subject: currentExam.subject,
      marksObtained,
      totalMarks,
      percentage,
      division,
      timestamp: new Date().toLocaleString('hi-IN'),
    });

    setExamResult(calculatedResult);
    setExamState('RESULT');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetakeExam = () => {
    if (currentExam) {
      setExamResult(null);
      setExamState('IN_EXAM');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChooseNewExam = () => {
    setCurrentExam(null);
    setExamResult(null);
    setExamState('DASHBOARD');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenResultGmail = () => {
    if (currentExam && examResult) {
      setExamToEmail(currentExam);
      setGmailSendMode('RESULT');
      setIsGmailSendOpen(true);
    }
  };

  const handleOpenPaperGmail = (exam: ExamPaper) => {
    setExamToEmail(exam);
    setGmailSendMode('QUESTION_PAPER');
    setIsGmailSendOpen(true);
  };

  const handleOpenNcertBook = (
    questionText: string,
    topic?: string,
    explanation?: string,
    correctOptionText?: string
  ) => {
    const matched = findNcertSnippetForQuestion(
      questionText,
      topic,
      explanation,
      correctOptionText
    );
    if (matched) {
      setNcertSubjectId(matched.subject.id);
      setNcertChapterId(matched.chapter.id);
      setNcertTargetSnippet(matched.snippet);
      setNcertTargetQuestionText(questionText);
    } else {
      setNcertSubjectId('physics');
      setNcertChapterId('phy-ch10');
      setNcertTargetSnippet(null);
      setNcertTargetQuestionText(questionText);
    }
    setIsNcertReaderOpen(true);
  };

  const handleOpenNcertLibrary = (subjectId?: string) => {
    if (subjectId) {
      setNcertSubjectId(subjectId);
      const sub = NCERT_SUBJECTS.find((s) => s.id === subjectId);
      if (sub && sub.chapters.length > 0) {
        setNcertChapterId(sub.chapters[0].id);
      }
    }
    setNcertTargetSnippet(null);
    setNcertTargetQuestionText(undefined);
    setIsNcertReaderOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Header with Google Sign-in & Admin Access */}
      <Header
        candidate={candidate}
        onEditCandidate={() => setIsCandidateModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenBooks={() => handleOpenNcertLibrary()}
        onOpenMistakes={() => setIsMistakeNotebookOpen(true)}
        onOpenFormulas={() => setIsFormulaSheetOpen(true)}
        onOpenPrintOmr={() => setIsPrintableOmrOpen(true)}
        onOpenDailyChallenge={() => setIsDailyChallengeOpen(true)}
        mistakeCount={mistakeCount}
        currentStreak={currentStreak}
        isExamInProgress={examState === 'IN_EXAM'}
        user={user}
        onSignInGoogle={handleSignInGoogle}
        onSignOutGoogle={handleSignOutGoogle}
        isAdmin={isAdmin}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-12">
        {examState === 'DASHBOARD' && (
          <HomeDashboard
            candidate={candidate}
            onEditCandidate={() => setIsCandidateModalOpen(true)}
            onSelectExam={handleStartExam}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenHelp={() => setIsHelpModalOpen(true)}
            onEmailExamPaper={handleOpenPaperGmail}
            onOpenBooks={(subId) => handleOpenNcertLibrary(subId)}
            onOpenMistakes={() => setIsMistakeNotebookOpen(true)}
            onOpenFormulas={() => setIsFormulaSheetOpen(true)}
            onOpenPrintOmr={() => setIsPrintableOmrOpen(true)}
            onOpenDailyChallenge={() => setIsDailyChallengeOpen(true)}
            mistakeCount={mistakeCount}
            currentStreak={currentStreak}
            noticeBanner={adminConfig.noticeBanner}
            isNoticeActive={adminConfig.isNoticeActive}
            customExams={adminCustomExams}
          />
        )}

        {examState === 'IN_EXAM' && currentExam && (
          <ExamScreen
            exam={currentExam}
            candidate={candidate}
            onSubmitExam={handleSubmitExam}
            onExitExam={handleChooseNewExam}
          />
        )}

        {examState === 'RESULT' && currentExam && examResult && (
          <ResultView
            exam={currentExam}
            result={examResult}
            candidate={candidate}
            onRetakeExam={handleRetakeExam}
            onChooseNewExam={handleChooseNewExam}
            onOpenGmailSend={handleOpenResultGmail}
            onOpenNcertBook={handleOpenNcertBook}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-stone-900 text-stone-400 text-xs py-6 border-t border-stone-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-semibold text-stone-200">
              बिहार विद्यालय परीक्षा समिति (BSEB) ऑनलाइन अभ्यास एवं परीक्षा पोर्टल
            </p>
            <p className="text-stone-500 text-[11px] mt-0.5">
              कक्षा 10वीं (मैट्रिक) हिन्दी माध्यम • मुख्य प्रशासक: {adminConfig.adminEmail}
            </p>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            {isAdmin ? (
              <button
                onClick={() => setIsAdminPanelOpen(true)}
                className="text-amber-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>👑 एडमिन कंसोल</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="hover:text-amber-300 transition text-stone-400"
              >
                एडमिन लॉगिन
              </button>
            )}
            <span>•</span>
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="hover:text-amber-300 transition"
            >
              चलाएं और पब्लिश करें
            </button>
            <span>•</span>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="hover:text-amber-300 transition"
            >
              PDF अपलोड
            </button>
          </div>
        </div>
      </footer>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onExamLoaded={(extractedExam) => {
          handleStartExam(extractedExam);
        }}
      />

      {/* Candidate Modal */}
      <CandidateModal
        isOpen={isCandidateModalOpen}
        onClose={() => setIsCandidateModalOpen(false)}
        candidate={candidate}
        onSave={(info) => setCandidate(info)}
      />

      {/* Publish and Run Guide Modal */}
      <PublishGuideModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* Gmail Send Modal */}
      {examToEmail && (
        <GmailSendModal
          isOpen={isGmailSendOpen}
          onClose={() => {
            setIsGmailSendOpen(false);
            setExamToEmail(null);
          }}
          candidate={candidate}
          exam={examToEmail}
          result={gmailSendMode === 'RESULT' ? examResult : null}
          mode={gmailSendMode}
          userEmail={user?.email}
        />
      )}

      {/* Admin Panel Modal (Super Admin Console) */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onRefreshExams={handleRefreshExams}
        onAdminLoggedOut={() => setIsAdmin(false)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onAdminAuthenticated={() => {
          setIsAdmin(true);
          setIsAdminPanelOpen(true);
        }}
        onGoogleSignIn={handleSignInGoogle}
      />

      {/* NCERT Class 10 e-Books Reader Modal with Direct Answer Highlighting */}
      <NcertBookReaderModal
        isOpen={isNcertReaderOpen}
        onClose={() => setIsNcertReaderOpen(false)}
        initialSubjectId={ncertSubjectId}
        initialChapterId={ncertChapterId}
        targetSnippet={ncertTargetSnippet}
        targetQuestionText={ncertTargetQuestionText}
      />

      {/* Mistake Notebook Modal */}
      <MistakeNotebookModal
        isOpen={isMistakeNotebookOpen}
        onClose={() => setIsMistakeNotebookOpen(false)}
        onStartReTest={(reTestPaper) => handleStartExam(reTestPaper)}
        onOpenNcertBook={handleOpenNcertBook}
      />

      {/* Formula & Key Revision Sheet Modal */}
      <FormulaSheetModal
        isOpen={isFormulaSheetOpen}
        onClose={() => setIsFormulaSheetOpen(false)}
      />

      {/* Printable Authentic BSEB OMR Modal */}
      <PrintableOmrModal
        isOpen={isPrintableOmrOpen}
        onClose={() => setIsPrintableOmrOpen(false)}
        candidate={candidate}
      />

      {/* Daily 10-Minute Challenge Modal */}
      <DailyChallengeModal
        isOpen={isDailyChallengeOpen}
        onClose={() => setIsDailyChallengeOpen(false)}
        onStartChallenge={(dailyPaper) => handleStartExam(dailyPaper)}
      />
    </div>
  );
}
