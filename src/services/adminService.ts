import { User } from 'firebase/auth';
import { AdminConfig, StudentSubmissionRecord } from '../types/admin';
import { ExamPaper } from '../types/exam';

const ADMIN_EMAIL = 'jawedbhai414@gmail.com';
const STORAGE_KEY_CONFIG = 'bseb_admin_config_v1';
const STORAGE_KEY_RESULTS = 'bseb_admin_student_results_v1';
const STORAGE_KEY_CUSTOM_EXAMS = 'bseb_admin_custom_exams_v1';
const STORAGE_KEY_SESSION_UNLOCKED = 'bseb_admin_unlocked_session';

const DEFAULT_CONFIG: AdminConfig = {
  adminEmail: ADMIN_EMAIL,
  adminPin: 'bseb@2025',
  noticeBanner: 'बिहार बोर्ड मैट्रिक वार्षिक परीक्षा 2026: सभी विषयों के नए मॉडल पेपर उपलब्ध हैं। नियमित अभ्यास करें!',
  isNoticeActive: true,
  allowStudentPdfUpload: true,
  defaultExamTimeMinutes: 30,
};

export const getAdminConfig = (): AdminConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load admin config', e);
  }
  return DEFAULT_CONFIG;
};

export const saveAdminConfig = (config: AdminConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save admin config', e);
  }
};

export const isUserAdmin = (user: User | null): boolean => {
  if (user && user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return true;
  }
  // Check if session pin unlocked
  return sessionStorage.getItem(STORAGE_KEY_SESSION_UNLOCKED) === 'true';
};

export const verifyAdminPin = (enteredPin: string): boolean => {
  const config = getAdminConfig();
  if (enteredPin.trim() === config.adminPin.trim()) {
    sessionStorage.setItem(STORAGE_KEY_SESSION_UNLOCKED, 'true');
    return true;
  }
  return false;
};

export const lockAdminSession = (): void => {
  sessionStorage.removeItem(STORAGE_KEY_SESSION_UNLOCKED);
};

// Student Results Management
export const getStudentSubmissions = (): StudentSubmissionRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESULTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load student results', e);
  }
  return [];
};

export const recordStudentSubmission = (record: StudentSubmissionRecord): void => {
  try {
    const current = getStudentSubmissions();
    const updated = [record, ...current].slice(0, 100); // keep last 100
    localStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save student submission record', e);
  }
};

export const clearStudentSubmissions = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY_RESULTS);
  } catch (e) {
    console.error('Failed to clear submissions', e);
  }
};

export const exportSubmissionsAsCSV = (): void => {
  const records = getStudentSubmissions();
  if (records.length === 0) return;

  const headers = ['दिनांक व समय', 'परीक्षार्थी का नाम', 'रोल कोड', 'रोल नंबर', 'विषय', 'प्राप्तांक', 'कुल अंक', 'प्रतिशत', 'श्रेणी'];
  const rows = records.map((r) => [
    `"${r.timestamp}"`,
    `"${r.candidateName}"`,
    `"${r.rollCode}"`,
    `"${r.rollNumber}"`,
    `"${r.subject}"`,
    r.marksObtained,
    r.totalMarks,
    `"${r.percentage.toFixed(1)}%"`,
    `"${r.division}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `bseb_matric_student_results_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Custom Exams created by Admin
export const getAdminCustomExams = (): ExamPaper[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_EXAMS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load custom exams', e);
  }
  return [];
};

export const saveAdminCustomExam = (exam: ExamPaper): void => {
  try {
    const current = getAdminCustomExams();
    const index = current.findIndex((e) => e.id === exam.id);
    let updated: ExamPaper[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = exam;
    } else {
      updated = [exam, ...current];
    }
    localStorage.setItem(STORAGE_KEY_CUSTOM_EXAMS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save custom exam', e);
  }
};

export const deleteAdminCustomExam = (examId: string): void => {
  try {
    const current = getAdminCustomExams();
    const updated = current.filter((e) => e.id !== examId);
    localStorage.setItem(STORAGE_KEY_CUSTOM_EXAMS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete custom exam', e);
  }
};
