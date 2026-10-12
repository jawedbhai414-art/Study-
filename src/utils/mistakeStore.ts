import { ExamPaper, ExamResult, OptionKey } from '../types/exam';

export interface SavedMistake {
  id: string;
  questionId: number;
  questionNumber: string;
  questionText: string;
  options: string[];
  correctOption: OptionKey;
  studentOption?: OptionKey;
  explanation: string;
  topic?: string;
  subject: string;
  examTitle: string;
  savedAt: string;
}

const STORAGE_KEY = 'bseb_student_mistakes_v1';

export const getSavedMistakes = (): SavedMistake[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load mistakes from localStorage', e);
    return [];
  }
};

export const saveMistakesFromResult = (
  exam: ExamPaper,
  result: ExamResult
): number => {
  if (typeof window === 'undefined') return 0;
  try {
    const existing = getSavedMistakes();
    const existingMap = new Map(existing.map((m) => [m.id, m]));
    let newlyAdded = 0;

    exam.questions.forEach((q) => {
      const studentAns = result.answers[q.id];
      const isWrong = studentAns !== undefined && studentAns !== q.correctOption;

      if (isWrong) {
        const mistakeId = `${exam.id}_q${q.id}`;
        existingMap.set(mistakeId, {
          id: mistakeId,
          questionId: q.id,
          questionNumber: q.questionNumber,
          questionText: q.questionText,
          options: q.options,
          correctOption: q.correctOption,
          studentOption: studentAns,
          explanation: q.explanation,
          topic: q.topic,
          subject: exam.subject,
          examTitle: exam.examTitle,
          savedAt: new Date().toISOString(),
        });
        newlyAdded++;
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(existingMap.values())));
    return newlyAdded;
  } catch (e) {
    console.error('Failed to save mistakes', e);
    return 0;
  }
};

export const removeMistake = (mistakeId: string): SavedMistake[] => {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedMistakes();
    const updated = current.filter((m) => m.id !== mistakeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to remove mistake', e);
    return [];
  }
};

export const clearAllMistakes = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear mistakes', e);
  }
};

// Generates a dynamic ExamPaper consisting only of the saved mistakes
export const createMistakeReTestPaper = (mistakes: SavedMistake[]): ExamPaper => {
  return {
    id: `mistake-retest-${Date.now()}`,
    examTitle: '📝 ग़लतियों की डायरी - सुधार एवं पुनरभ्यास परीक्षा (Mistake Re-Test)',
    subject: 'कमजोर प्रश्नों का विशेष अभ्यास (Special Weak-Areas Test)',
    subjectCode: 'MISTAKE-RETEST',
    totalMarks: mistakes.length,
    suggestedTimeMinutes: Math.max(10, Math.ceil(mistakes.length * 1.5)),
    instructions: [
      'यह विशेष परीक्षा आपकी पिछली परीक्षाओं में गलत हुए प्रश्नों पर आधारित है।',
      'प्रत्येक प्रश्न का ध्यानपूर्वक उत्तर दें ताकि आपकी ग़लतियाँ पूरी तरह सुधर सकें।',
      '100% अंक लाने तक पुनः प्रयास करें!',
    ],
    questions: mistakes.map((m, index) => ({
      id: index + 1,
      questionNumber: `प्र. ${index + 1}`,
      questionText: m.questionText,
      options: m.options,
      correctOption: m.correctOption,
      marks: 1,
      explanation: m.explanation,
      topic: m.topic || m.subject,
    })),
    isCustomUploaded: true,
  };
};
