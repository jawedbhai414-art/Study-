import React, { useState, useEffect } from 'react';
import { X, Flame, Trophy, Play, CheckCircle2, Clock, Calendar, Sparkles } from 'lucide-react';
import { getStreakData, StreakData } from '../utils/streakStore';
import { SAMPLE_EXAMS } from '../data/sampleExams';
import { ExamPaper } from '../types/exam';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChallenge: (examPaper: ExamPaper) => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
  onStartChallenge,
}) => {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 1,
    bestStreak: 1,
    lastCompletedDate: '',
    totalChallengesCompleted: 0,
  });

  useEffect(() => {
    if (isOpen) {
      setStreakData(getStreakData());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];
  const isDoneToday = streakData.lastCompletedDate === today;

  const handleLaunchChallenge = () => {
    // Collect 10 random high-yield questions from sample exams
    const allQuestions = SAMPLE_EXAMS.flatMap((exam) =>
      exam.questions.map((q) => ({
        ...q,
        topic: q.topic || exam.subject,
      }))
    );

    // Shuffle and pick 10
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10).map((q, idx) => ({
      ...q,
      id: idx + 1,
      questionNumber: `प्र. ${idx + 1}`,
      marks: 1,
    }));

    const dailyPaper: ExamPaper = {
      id: `daily-challenge-${today}`,
      examTitle: `🔥 आज का 10-मिनट रैपिड चैलेंज (${new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })})`,
      subject: 'दैनिक त्वरित अभ्यास (All Subjects Rapid 10)',
      subjectCode: 'DAILY-10',
      totalMarks: 10,
      suggestedTimeMinutes: 10,
      instructions: [
        'इस रैपिड टेस्ट में सभी विषयों के 10 सबसे महत्वपूर्ण प्रश्न हैं।',
        'कुल समय: 10 मिनट।',
        'टेस्ट पूरा करने पर आपकी डेली स्ट्रीक (🔥 Streak) आगे बढ़ेगी!',
      ],
      questions: selected,
      isCustomUploaded: true,
    };

    onClose();
    onStartChallenge(dailyPaper);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col border border-stone-200 overflow-hidden">
        {/* Header with Flame Banner */}
        <div className="px-6 py-6 bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 text-white flex flex-col items-center text-center relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-3xl bg-white/20 border-2 border-white/30 flex items-center justify-center mb-3 shadow-inner">
            <Flame className="w-10 h-10 text-yellow-200 animate-bounce" />
          </div>

          <h2 className="text-2xl font-black font-serif tracking-tight">
            दैनिक 10-मिनट रैपिड चैलेंज
          </h2>
          <p className="text-xs text-orange-100 mt-1 max-w-xs">
            रोज़ाना 10 प्रश्नों का त्वरित अभ्यास करें और बोर्ड टॉपर की तरह अपनी तैयारी का स्तर बनाए रखें!
          </p>
        </div>

        {/* Streak Stats */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-orange-50 rounded-2xl border-2 border-orange-200 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-orange-700">
                <Flame className="w-4 h-4 text-orange-600" />
                <span>चालू स्ट्रीक (Current)</span>
              </div>
              <div className="text-3xl font-black text-orange-950 font-mono">
                {streakData.currentStreak}{' '}
                <span className="text-sm font-semibold text-orange-700">दिन</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>सर्वश्रेष्ठ स्ट्रीक (Best)</span>
              </div>
              <div className="text-3xl font-black text-amber-950 font-mono">
                {streakData.bestStreak}{' '}
                <span className="text-sm font-semibold text-amber-700">दिन</span>
              </div>
            </div>
          </div>

          {/* Status Note */}
          {isDoneToday ? (
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-300 flex items-center gap-3 text-emerald-950">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold block">
                  आज का चैलेंज पूरा हो चुका है! 🎉
                </span>
                आप चाहें तो अभ्यास के लिए दोबारा भी यह टेस्ट दे सकते हैं।
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 flex items-center gap-3 text-amber-950">
              <Sparkles className="w-6 h-6 text-amber-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold block">
                  आज का चैलेंज बाकी है!
                </span>
                अपनी स्ट्रीक कायम रखने के लिए अभी 10 मिनट निकालें।
              </div>
            </div>
          )}

          {/* Quick info badges */}
          <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
            <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200">
              <Clock className="w-4 h-4 text-stone-400" />
              <span>समय: केवल 10 मिनट</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200">
              <Calendar className="w-4 h-4 text-stone-400" />
              <span>10 VVI बहुविकल्पीय प्रश्न</span>
            </div>
          </div>

          {/* Start CTA */}
          <button
            onClick={handleLaunchChallenge}
            className="w-full py-3.5 bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>
              {isDoneToday ? 'दोबारा अभ्यास शुरू करें' : '🔥 अभी 10-मिनट चैलेंज शुरू करें'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
