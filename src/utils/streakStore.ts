export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string; // YYYY-MM-DD
  totalChallengesCompleted: number;
}

const STREAK_KEY = 'bseb_student_streak_v1';

export const getStreakData = (): StreakData => {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, bestStreak: 0, lastCompletedDate: '', totalChallengesCompleted: 0 };
  }
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) {
      return { currentStreak: 1, bestStreak: 1, lastCompletedDate: '', totalChallengesCompleted: 0 };
    }
    return JSON.parse(raw);
  } catch {
    return { currentStreak: 1, bestStreak: 1, lastCompletedDate: '', totalChallengesCompleted: 0 };
  }
};

export const recordDailyChallengeCompleted = (): StreakData => {
  const data = getStreakData();
  const today = new Date().toISOString().split('T')[0];

  if (data.lastCompletedDate === today) {
    // Already recorded today
    return data;
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newCurrent = data.currentStreak;

  if (data.lastCompletedDate === yesterday) {
    newCurrent += 1;
  } else if (!data.lastCompletedDate) {
    newCurrent = 1;
  } else {
    // Missed a day
    newCurrent = 1;
  }

  const newBest = Math.max(data.bestStreak, newCurrent);
  const updated: StreakData = {
    currentStreak: newCurrent,
    bestStreak: newBest,
    lastCompletedDate: today,
    totalChallengesCompleted: (data.totalChallengesCompleted || 0) + 1,
  };

  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save streak', e);
  }

  return updated;
};
