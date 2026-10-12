import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  BookOpen,
  Users,
  Settings,
  Lock,
  Plus,
  Trash2,
  Edit3,
  Download,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Clock,
  Key,
  LogOut,
  Save,
  Search,
  Eye,
} from 'lucide-react';
import {
  getAdminConfig,
  saveAdminConfig,
  getStudentSubmissions,
  clearStudentSubmissions,
  exportSubmissionsAsCSV,
  getAdminCustomExams,
  saveAdminCustomExam,
  deleteAdminCustomExam,
  lockAdminSession,
} from '../services/adminService';
import { ExamPaper, Question, OptionKey } from '../types/exam';
import { SAMPLE_EXAMS } from '../data/sampleExams';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshExams: () => void;
  onAdminLoggedOut: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onRefreshExams,
  onAdminLoggedOut,
}) => {
  const [activeTab, setActiveTab] = useState<'PAPERS' | 'RESULTS' | 'SETTINGS' | 'SECURITY'>('PAPERS');
  const [config, setConfig] = useState(getAdminConfig());
  const [submissions, setSubmissions] = useState(getStudentSubmissions());
  const [customExams, setCustomExams] = useState<ExamPaper[]>(getAdminCustomExams());

  // Edit / Create Exam State
  const [isCreatingExam, setIsCreatingExam] = useState<boolean>(false);
  const [examToEdit, setExamToEdit] = useState<ExamPaper | null>(null);

  // New Exam Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubject, setNewSubject] = useState<string>('भौतिक विज्ञान (Physics)');
  const [newCode, setNewCode] = useState<string>('112-P');
  const [newTime, setNewTime] = useState<number>(30);
  const [newQuestions, setNewQuestions] = useState<Question[]>([
    {
      id: 1,
      questionNumber: 'प्र. 1',
      questionText: 'प्रकाश के परावर्तन के कितने नियम हैं?',
      options: ['1', '2', '3', '4'],
      correctOption: 'B',
      marks: 1,
      explanation: 'प्रकाश के परावर्तन के दो मुख्य नियम होते हैं: आपतन कोण बराबर परावर्तन कोण, तथा आपतित किरण, अभिलंब और परावर्तित किरण एक ही तल में होते हैं।',
      topic: 'प्रकाश',
    },
  ]);

  // Notice & Settings State
  const [noticeText, setNoticeText] = useState<string>(config.noticeBanner);
  const [isNoticeActive, setIsNoticeActive] = useState<boolean>(config.isNoticeActive);
  const [allowPdfUpload, setAllowPdfUpload] = useState<boolean>(config.allowStudentPdfUpload);
  const [defaultTime, setDefaultTime] = useState<number>(config.defaultExamTimeMinutes);

  // Security State
  const [currentPin, setCurrentPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState<string | null>(null);
  const [pinErrorMsg, setPinErrorMsg] = useState<string | null>(null);

  // Search filter for submissions
  const [resultSearchQuery, setResultSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    const updated = {
      ...config,
      noticeBanner: noticeText,
      isNoticeActive: isNoticeActive,
      allowStudentPdfUpload: allowPdfUpload,
      defaultExamTimeMinutes: defaultTime,
    };
    setConfig(updated);
    saveAdminConfig(updated);
    alert('एडमिन सेटिंग्स सफलतापूर्वक सहेजी गईं!');
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinSuccessMsg(null);
    setPinErrorMsg(null);

    if (currentPin.trim() !== config.adminPin.trim()) {
      setPinErrorMsg('वर्तमान एडमिन पिन गलत है।');
      return;
    }
    if (newPin.trim().length < 4) {
      setPinErrorMsg('नया पिन कम से कम 4 अक्षरों का होना चाहिए।');
      return;
    }

    const updated = { ...config, adminPin: newPin.trim() };
    setConfig(updated);
    saveAdminConfig(updated);
    setPinSuccessMsg('एडमिन पिन सफलतापूर्वक बदल दिया गया!');
    setCurrentPin('');
    setNewPin('');
  };

  const handleAddQuestionToNewExam = () => {
    const nextId = newQuestions.length + 1;
    setNewQuestions([
      ...newQuestions,
      {
        id: nextId,
        questionNumber: `प्र. ${nextId}`,
        questionText: 'नया वस्तुनिष्ठ प्रश्न...',
        options: ['विकल्प A', 'विकल्प B', 'विकल्प C', 'विकल्प D'],
        correctOption: 'A',
        marks: 1,
        explanation: 'इस प्रश्न की हिन्दी व्याख्या यहाँ लिखें।',
        topic: newSubject,
      },
    ]);
  };

  const handleSaveNewExam = () => {
    if (!newTitle.trim()) {
      alert('कृपया प्रश्न पत्र का शीर्षक दर्ज करें।');
      return;
    }

    const newExam: ExamPaper = {
      id: `admin-exam-${Date.now()}`,
      examTitle: newTitle,
      subject: newSubject,
      subjectCode: newCode,
      totalMarks: newQuestions.length,
      suggestedTimeMinutes: newTime,
      instructions: [
        'सभी वस्तुनिष्ठ प्रश्न अनिवार्य हैं।',
        'प्रत्येक प्रश्न का 1 अंक निर्धारित है।',
        'ओएमआर शीट पर सही वृत्त भरें।',
      ],
      questions: newQuestions,
      isCustomUploaded: false,
    };

    saveAdminCustomExam(newExam);
    setCustomExams(getAdminCustomExams());
    setIsCreatingExam(false);
    setNewTitle('');
    onRefreshExams();
    alert('नया प्रश्न पत्र सफलतापूर्वक पोर्टल पर जोड़ दिया गया!');
  };

  const handleDeleteCustomExam = (examId: string) => {
    if (window.confirm('क्या आप वाकई इस प्रश्न पत्र को पोर्टल से हटाना चाहते हैं?')) {
      deleteAdminCustomExam(examId);
      setCustomExams(getAdminCustomExams());
      onRefreshExams();
    }
  };

  const handleClearSubmissions = () => {
    if (window.confirm('क्या आप सभी विद्यार्थियों के परीक्षा रिकॉर्ड हटाना चाहते हैं?')) {
      clearStudentSubmissions();
      setSubmissions([]);
    }
  };

  const handleLogout = () => {
    lockAdminSession();
    onAdminLoggedOut();
    onClose();
  };

  const filteredSubmissions = submissions.filter(
    (s) =>
      s.candidateName.toLowerCase().includes(resultSearchQuery.toLowerCase()) ||
      s.rollNumber.includes(resultSearchQuery) ||
      s.subject.toLowerCase().includes(resultSearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border-2 border-amber-600/50 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Admin Header */}
        <div className="bg-gradient-to-r from-stone-950 via-amber-950 to-stone-900 text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base font-heading text-white">
                  मुख्य व्यवस्थापक नियंत्रण कक्ष (Super Admin Console)
                </h3>
                <span className="text-[10px] bg-amber-500 text-amber-950 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  स्वामी (Owner)
                </span>
              </div>
              <p className="text-[11px] text-amber-200/90 font-mono">
                अधिकृत प्रशासक: {config.adminEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="text-xs bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
              title="एडमिन सत्र लॉक करें"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">लॉगआउट</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-stone-100 border-b border-stone-200 px-4 flex items-center gap-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('PAPERS')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition flex-shrink-0 ${
              activeTab === 'PAPERS'
                ? 'border-amber-700 text-amber-900 font-bold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span>प्रश्न पत्र प्रबंधन ({SAMPLE_EXAMS.length + customExams.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('RESULTS')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition flex-shrink-0 ${
              activeTab === 'RESULTS'
                ? 'border-amber-700 text-amber-900 font-bold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-4 h-4 text-blue-700" />
            <span>छात्र परिणाम रिकॉर्ड ({submissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition flex-shrink-0 ${
              activeTab === 'SETTINGS'
                ? 'border-amber-700 text-amber-900 font-bold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Settings className="w-4 h-4 text-stone-700" />
            <span>नोटिस व सेटिंग्स</span>
          </button>

          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 transition flex-shrink-0 ${
              activeTab === 'SECURITY'
                ? 'border-amber-700 text-amber-900 font-bold bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-700" />
            <span>सुरक्षा व पिन (Security)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-stone-50/50">
          {/* TAB 1: EXAM PAPERS MANAGEMENT */}
          {activeTab === 'PAPERS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">पोर्टल पर उपलब्ध सभी प्रश्न पत्र</h4>
                  <p className="text-xs text-stone-500">
                    आप नए प्रश्न पत्र जोड़ सकते हैं, या मौजूदा पेपर्स की समीक्षा कर सकते हैं।
                  </p>
                </div>
                <button
                  onClick={() => setIsCreatingExam(!isCreatingExam)}
                  className="flex items-center gap-1.5 bg-amber-800 hover:bg-amber-900 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isCreatingExam ? 'रद्द करें' : 'नया प्रश्न पत्र जोड़ें'}</span>
                </button>
              </div>

              {/* Form to create new question paper */}
              {isCreatingExam && (
                <div className="p-4 bg-white border-2 border-amber-300 rounded-2xl shadow-sm space-y-4">
                  <h5 className="font-bold text-xs text-amber-950 uppercase tracking-wider">
                    नया प्रश्न पत्र तैयार करें (Create New Examination Paper)
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        प्रश्न पत्र शीर्षक (Exam Title) *
                      </label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="उदा. बिहार बोर्ड मैट्रिक 2026 स्पेशल टेस्ट"
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        विषय (Subject) *
                      </label>
                      <select
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none bg-stone-50"
                      >
                        <option value="भौतिक विज्ञान (Physics)">भौतिक विज्ञान (Physics)</option>
                        <option value="रसायन विज्ञान (Chemistry)">रसायन विज्ञान (Chemistry)</option>
                        <option value="जीव विज्ञान (Biology)">जीव विज्ञान (Biology)</option>
                        <option value="गणित (Mathematics)">गणित (Mathematics)</option>
                        <option value="सामाजिक विज्ञान (Social Science / SST)">सामाजिक विज्ञान (SST)</option>
                        <option value="हिन्दी (Hindi मातृभाषा)">हिन्दी (Hindi)</option>
                        <option value="उर्दू (Urdu दरक्षां)">उर्दू (Urdu)</option>
                        <option value="संस्कृत (Sanskrit पीयूषम्)">संस्कृत (Sanskrit)</option>
                        <option value="अंग्रेजी (English)">अंग्रेजी (English)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        विषय कोड (Subject Code)
                      </label>
                      <input
                        type="text"
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        placeholder="112"
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        समय सीमा (Time in Minutes)
                      </label>
                      <input
                        type="number"
                        value={newTime}
                        onChange={(e) => setNewTime(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800">
                        प्रश्न सूची ({newQuestions.length} प्रश्न)
                      </span>
                      <button
                        type="button"
                        onClick={handleAddQuestionToNewExam}
                        className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-1 rounded border transition flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>प्रश्न जोड़ें</span>
                      </button>
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-3 p-1">
                      {newQuestions.map((q, idx) => (
                        <div key={idx} className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-2">
                          <div className="flex items-center justify-between font-bold text-stone-700">
                            <span>प्रश्न #{idx + 1}</span>
                            <div className="flex items-center gap-2">
                              <span>सही उत्तर:</span>
                              <select
                                value={q.correctOption}
                                onChange={(e) => {
                                  const updated = [...newQuestions];
                                  updated[idx].correctOption = e.target.value as OptionKey;
                                  setNewQuestions(updated);
                                }}
                                className="bg-white border border-stone-300 rounded px-1.5 py-0.5 font-bold text-emerald-800"
                              >
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                              </select>
                            </div>
                          </div>

                          <input
                            type="text"
                            value={q.questionText}
                            onChange={(e) => {
                              const updated = [...newQuestions];
                              updated[idx].questionText = e.target.value;
                              setNewQuestions(updated);
                            }}
                            placeholder="प्रश्न का पाठ..."
                            className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                          />

                          <div className="grid grid-cols-2 gap-2">
                            {q.options.map((opt, optIdx) => (
                              <input
                                key={optIdx}
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...newQuestions];
                                  const newOpts = [...updated[idx].options];
                                  newOpts[optIdx] = e.target.value;
                                  updated[idx].options = newOpts;
                                  setNewQuestions(updated);
                                }}
                                placeholder={`विकल्प ${String.fromCharCode(65 + optIdx)}`}
                                className="p-1.5 bg-white border border-stone-200 rounded text-xs"
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <button
                      type="button"
                      onClick={() => setIsCreatingExam(false)}
                      className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveNewExam}
                      className="px-4 py-1.5 text-xs font-bold bg-amber-800 hover:bg-amber-900 text-white rounded-lg shadow transition"
                    >
                      पेपर सहेजें और प्रकाशित करें
                    </button>
                  </div>
                </div>
              )}

              {/* List of Custom and Preloaded Papers */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-600 uppercase">
                  सक्रिय प्रश्न पत्र सूची ({SAMPLE_EXAMS.length + customExams.length})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Custom Exams created by Admin */}
                  {customExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="p-3 bg-white border-2 border-amber-400 rounded-xl shadow-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                          कस्टम एडमिन पेपर
                        </span>
                        <h6 className="font-bold text-xs text-stone-900 mt-1">{exam.subject}</h6>
                        <p className="text-[11px] text-stone-500">{exam.examTitle} ({exam.questions.length} प्रश्न)</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCustomExam(exam.id)}
                        className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition"
                        title="हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Standard Preloaded BSEB Model Papers */}
                  {SAMPLE_EXAMS.map((exam) => (
                    <div
                      key={exam.id}
                      className="p-3 bg-white border border-stone-200 rounded-xl shadow-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-stone-100 text-stone-700 font-mono font-bold px-1.5 py-0.5 rounded">
                            कोड: {exam.subjectCode}
                          </span>
                          <span className="text-[10px] text-stone-500">{exam.suggestedTimeMinutes} मिनट</span>
                        </div>
                        <h6 className="font-bold text-xs text-stone-900 mt-1">{exam.subject}</h6>
                        <p className="text-[11px] text-stone-500">{exam.questions.length} वस्तुनिष्ठ प्रश्न (OMR)</p>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                        सक्रिय
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDENT RESULTS RECORD */}
          {activeTab === 'RESULTS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">परीक्षार्थियों के परिणाम व अंक रिकॉर्ड</h4>
                  <p className="text-xs text-stone-500">
                    यहाँ विद्यार्थियों द्वारा दी गई परीक्षाओं के अंक, प्रतिशत और समय सुरक्षित रहते हैं।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={exportSubmissionsAsCSV}
                    disabled={submissions.length === 0}
                    className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV / Excel डाउनलोड करें</span>
                  </button>

                  <button
                    onClick={handleClearSubmissions}
                    disabled={submissions.length === 0}
                    className="flex items-center gap-1 bg-stone-200 hover:bg-red-100 text-stone-700 hover:text-red-700 disabled:opacity-50 px-2.5 py-1.5 rounded-xl text-xs transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>रिकॉर्ड साफ़ करें</span>
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={resultSearchQuery}
                  onChange={(e) => setResultSearchQuery(e.target.value)}
                  placeholder="विद्यार्थी के नाम, रोल नंबर या विषय द्वारा खोजें..."
                  className="w-full px-3 py-2 pl-9 text-xs border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>

              {/* Table of Submissions */}
              {filteredSubmissions.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-xs text-stone-500">
                  अभी तक कोई परीक्षा परिणाम रिकॉर्ड नहीं हुआ है। जब छात्र परीक्षा सबमिट करेंगे, उनके अंक यहाँ दिखाई देंगे।
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-stone-100 text-stone-700 border-b border-stone-200 font-bold">
                          <th className="p-2.5">दिनांक व समय</th>
                          <th className="p-2.5">परीक्षार्थी</th>
                          <th className="p-2.5">रोल नं.</th>
                          <th className="p-2.5">विषय</th>
                          <th className="p-2.5">प्राप्तांक</th>
                          <th className="p-2.5">प्रतिशत</th>
                          <th className="p-2.5">श्रेणी</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredSubmissions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-amber-50/40 transition">
                            <td className="p-2.5 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                              {sub.timestamp}
                            </td>
                            <td className="p-2.5 font-bold text-stone-900">{sub.candidateName}</td>
                            <td className="p-2.5 font-mono text-stone-700">
                              {sub.rollCode}-{sub.rollNumber}
                            </td>
                            <td className="p-2.5 font-medium text-stone-800">{sub.subject}</td>
                            <td className="p-2.5 font-mono font-bold text-amber-900">
                              {sub.marksObtained} / {sub.totalMarks}
                            </td>
                            <td className="p-2.5 font-mono font-bold text-emerald-800">
                              {sub.percentage.toFixed(1)}%
                            </td>
                            <td className="p-2.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  sub.percentage >= 60
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : sub.percentage >= 45
                                    ? 'bg-blue-100 text-blue-900'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {sub.division}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: NOTICE BOARD & SETTINGS */}
          {activeTab === 'SETTINGS' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-stone-900">पोर्टल सूचना बोर्ड व सामान्य सेटिंग्स</h4>
                <p className="text-xs text-stone-500">
                  यहाँ से आप सभी विद्यार्थियों के लिए स्क्रीन के शीर्ष पर सूचना संदेश प्रसारित कर सकते हैं।
                </p>
              </div>

              {/* Notice Banner */}
              <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-700" />
                    <span className="font-bold text-xs text-stone-800">
                      सार्वजनिक नोटिस बैनर (Public Notice Banner)
                    </span>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNoticeActive}
                      onChange={(e) => setIsNoticeActive(e.target.checked)}
                      className="rounded text-amber-800 focus:ring-amber-600"
                    />
                    <span>बैनर सक्रिय रखें (Show Banner)</span>
                  </label>
                </div>

                <textarea
                  rows={2}
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  placeholder="परीक्षार्थियों के लिए महत्वपूर्ण सूचना लिखें..."
                  className="w-full p-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-600 focus:outline-none"
                />
              </div>

              {/* Exam Behavior Settings */}
              <div className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-3">
                <span className="font-bold text-xs text-stone-800 block">
                  परीक्षा नियम सेटिंग्स
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-stone-800">विद्यार्थी PDF अपलोड</p>
                      <p className="text-[11px] text-stone-500">छात्रों को प्रश्न पत्र PDF अपलोड की अनुमति</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowPdfUpload}
                      onChange={(e) => setAllowPdfUpload(e.target.checked)}
                      className="rounded text-amber-800 focus:ring-amber-600 w-4 h-4"
                    />
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <p className="font-bold text-stone-800">मानक परीक्षा समय</p>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        value={defaultTime}
                        onChange={(e) => setDefaultTime(Number(e.target.value))}
                        className="w-20 px-2 py-1 text-xs border rounded font-mono"
                      />
                      <span className="text-stone-500">मिनट प्रति पेपर</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveSettings}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-amber-800 hover:bg-amber-900 text-white rounded-xl shadow transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>सेटिंग्स सहेजें (Save Settings)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & PIN */}
          {activeTab === 'SECURITY' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-stone-900">सुरक्षा व एडमिन क्रेडेंशियल्स</h4>
                <p className="text-xs text-stone-500">
                  सुपर एडमिन ईमेल व सुरक्षा पिन प्रबंधन।
                </p>
              </div>

              {/* Owner Info Card */}
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
                    प्रमाणित स्वामी (Owner)
                  </span>
                  <p className="font-bold text-sm text-amber-950 mt-1 font-mono">
                    {config.adminEmail}
                  </p>
                  <p className="text-xs text-amber-900/80 mt-0.5">
                    इस Google ईमेल पते से लॉगिन करने पर एडमिन अधिकार स्वतः सक्रिय हो जाते हैं।
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6 text-amber-800" />
                </div>
              </div>

              {/* Change Admin PIN */}
              <form onSubmit={handleSavePin} className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-stone-700" />
                  <span className="font-bold text-xs text-stone-800">
                    एडमिन गुप्त पिन बदलें (Change Admin Passkey)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      वर्तमान पिन (Current PIN) *
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPin}
                      onChange={(e) => setCurrentPin(e.target.value)}
                      placeholder="वर्तमान पिन..."
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      नया पिन (New PIN) *
                    </label>
                    <input
                      type="password"
                      required
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="नया गोपनीय पिन..."
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {pinSuccessMsg && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{pinSuccessMsg}</span>
                  </div>
                )}

                {pinErrorMsg && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{pinErrorMsg}</span>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white rounded-lg shadow transition"
                  >
                    <span>पिन अपडेट करें</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
