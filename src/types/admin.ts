import { ExamPaper } from './exam';

export interface AdminConfig {
  adminEmail: string;
  adminPin: string;
  noticeBanner: string;
  isNoticeActive: boolean;
  allowStudentPdfUpload: boolean;
  defaultExamTimeMinutes: number;
}

export interface StudentSubmissionRecord {
  id: string;
  candidateName: string;
  rollCode: string;
  rollNumber: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  division: string;
  timestamp: string;
}
