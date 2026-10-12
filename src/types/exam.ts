export type OptionKey = 'A' | 'B' | 'C' | 'D';

export interface Question {
  id: number;
  questionNumber: string;
  questionText: string;
  options: string[];
  correctOption: OptionKey;
  marks: number;
  explanation: string;
  topic?: string;
}

export interface ExamPaper {
  id: string;
  examTitle: string;
  subject: string;
  subjectCode?: string;
  totalMarks: number;
  suggestedTimeMinutes: number;
  instructions: string[];
  questions: Question[];
  isCustomUploaded?: boolean;
}

export interface CandidateInfo {
  name: string;
  rollCode: string;
  rollNumber: string;
  registrationNumber: string;
  schoolName: string;
}

export interface ExamResult {
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  division: 'प्रथम श्रेणी (1st Division)' | 'द्वितीय श्रेणी (2nd Division)' | 'तृतीय श्रेणी (3rd Division)' | 'अनुत्तीर्ण (Fail)';
  timeTakenSeconds: number;
  answers: Record<number, OptionKey>;
  markedForReview: Record<number, boolean>;
}
