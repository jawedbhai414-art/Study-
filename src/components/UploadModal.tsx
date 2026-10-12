import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle2, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { ExamPaper } from '../types/exam';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamLoaded: (exam: ExamPaper) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onExamLoaded,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [examSubject, setExamSubject] = useState<string>('विज्ञान (Science)');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleUploadAndProcess = async () => {
    if (!selectedFile) {
      setErrorMessage('कृपया पहले कोई PDF या स्कैन की गई छवि चुनें।');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setLoadingStep('दस्तावेज़ पढ़ा जा रहा है (Reading file)...');

    try {
      const reader = new FileReader();

      const fileDataPromise = new Promise<{ base64: string; mimeType: string }>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve({
            base64: result,
            mimeType: selectedFile.type || 'application/pdf',
          });
        };
        reader.onerror = () => reject(new Error('फ़ाइल लोड करने में असमर्थ।'));
        reader.readAsDataURL(selectedFile);
      });

      const { base64, mimeType } = await fileDataPromise;

      setLoadingStep('AI द्वारा प्रश्न और हिन्दी विकल्प निकाले जा रहे हैं (Extracting Hindi Questions)...');

      const response = await fetch('/api/extract-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileBase64: base64,
          mimeType: mimeType,
          examSubject: examSubject,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'प्रश्न पत्र का विश्लेषण करने में विफलता हुई।');
      }

      setLoadingStep('परीक्षा पत्रक तैयार हो गया! (Exam loaded successfully)');

      const extracted = result.data;
      const formattedExam: ExamPaper = {
        id: `custom-${Date.now()}`,
        examTitle: extracted.examTitle || 'बिहार बोर्ड कक्षा 10वीं परीक्षा पत्रक',
        subject: extracted.subject || examSubject,
        totalMarks: extracted.totalMarks || extracted.questions.length,
        suggestedTimeMinutes: extracted.suggestedTimeMinutes || Math.max(15, extracted.questions.length * 2),
        instructions: extracted.instructions || [
          'सभी प्रश्न अनिवार्य हैं।',
          'प्रत्येक प्रश्न का 1 अंक निर्धारित है।',
          'सही विकल्प का चयन करें और ओएमआर पत्रक भरें।',
        ],
        questions: extracted.questions.map((q: any, idx: number) => ({
          id: q.id || idx + 1,
          questionNumber: q.questionNumber || `प्र. ${idx + 1}`,
          questionText: q.questionText,
          options: Array.isArray(q.options) && q.options.length >= 4 
            ? q.options.slice(0, 4) 
            : [q.options?.[0] || 'A', q.options?.[1] || 'B', q.options?.[2] || 'C', q.options?.[3] || 'D'],
          correctOption: (['A', 'B', 'C', 'D'].includes(q.correctOption?.toUpperCase()) ? q.correctOption.toUpperCase() : 'A') as 'A' | 'B' | 'C' | 'D',
          marks: q.marks || 1,
          explanation: q.explanation || 'इस प्रश्न का उत्तर बिहार बोर्ड मैट्रिक पाठ्यक्रम के अनुसार सत्य है।',
          topic: q.topic || examSubject,
        })),
        isCustomUploaded: true,
      };

      setTimeout(() => {
        setLoading(false);
        onExamLoaded(formattedExam);
        onClose();
      }, 500);

    } catch (err: any) {
      console.error(err);
      setLoading(false);
      setErrorMessage(
        err.message || 'फ़ाइल प्रोसेस करने में त्रुटि हुई। कृपया सुनिश्चित करें कि PDF में हिन्दी प्रश्न स्पष्ट हैं।'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800 to-red-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base font-heading">
              प्रश्न पत्र PDF / फ़ोटो अपलोड करें
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-stone-800">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-950 flex gap-2.5 items-start">
            <Sparkles className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900">
                स्वचालित हिन्दी OCR व प्रश्न निष्कर्षण
              </p>
              <p className="text-amber-800/90 mt-0.5">
                बिहार बोर्ड के किसी भी प्रश्न पत्र (PDF, स्कैन की गई कॉपी या कैमरे की फोटो) को अपलोड करें। AI स्वचालित रूप से सभी हिन्दी वस्तुनिष्ठ प्रश्नों, विकल्पों व सही उत्तरों को पहचान लेगा।
              </p>
            </div>
          </div>

          {/* Subject Dropdown */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              विषय चुनें (Subject)
            </label>
            <select
              value={examSubject}
              onChange={(e) => setExamSubject(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none bg-stone-50"
            >
              <option value="भौतिक विज्ञान (Physics)">भौतिक विज्ञान (Physics - 112-P)</option>
              <option value="रसायन विज्ञान (Chemistry)">रसायन विज्ञान (Chemistry - 112-C)</option>
              <option value="जीव विज्ञान (Biology)">जीव विज्ञान (Biology - 112-B)</option>
              <option value="गणित (Mathematics)">गणित (Mathematics - 110)</option>
              <option value="सामाजिक विज्ञान (Social Science - SST)">सामाजिक विज्ञान (Social Science / SST - 111)</option>
              <option value="हिन्दी (Hindi मातृभाषा)">हिन्दी (Hindi - 101)</option>
              <option value="उर्दू (Urdu दरक्षां व क़वाइद)">उर्दू (Urdu - 103)</option>
              <option value="संस्कृत (Sanskrit पीयूषम्)">संस्कृत (Sanskrit - 105)</option>
              <option value="अंग्रेजी (English)">अंग्रेजी (English - 113)</option>
              <option value="संपूर्ण विज्ञान (Complete Science)">संपूर्ण विज्ञान (Science - 112)</option>
              <option value="अन्य विषय">अन्य विषय / मॉडल पेपर</option>
            </select>
          </div>

          {/* File Picker Zone */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              प्रश्न पत्र फ़ाइल चुनें (PDF / Image) *
            </label>
            <div
              onClick={() => !loading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                selectedFile
                  ? 'border-emerald-500 bg-emerald-50/40'
                  : 'border-stone-300 hover:border-amber-500 bg-stone-50/50 hover:bg-amber-50/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />

              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-stone-900 truncate max-w-xs">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || 'दस्तावेज़'}
                  </p>
                  <span className="text-[11px] text-emerald-700 font-medium mt-2 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    फ़ाइल चुनी गई (क्लिक कर बदलें)
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-stone-500">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-stone-800">
                    यहाँ PDF या प्रश्न पत्र की फोटो अपलोड करें
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    फ़ोन गैलरी, कैमरा फोटो या PDF फ़ाइल चुनें
                  </p>
                  <span className="mt-3 text-xs bg-stone-200/80 text-stone-700 px-3 py-1 rounded-md">
                    फ़ाइल ब्राउज़ करें
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Loading status */}
          {loading && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-medium text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
                <span>{loadingStep}</span>
              </div>
              <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full animate-pulse w-3/4 rounded-full" />
              </div>
              <p className="text-[11px] text-amber-800/80">
                कृपया प्रतीक्षा करें, हिन्दी पाठ व विकल्पों का सटीक विश्लेषण किया जा रहा है...
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-800">त्रुटि (Error)</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-5 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-xs font-semibold text-stone-600 hover:text-stone-800 px-3 py-2 rounded-lg hover:bg-stone-200/50 transition"
          >
            रद्द करें
          </button>

          <button
            type="button"
            onClick={handleUploadAndProcess}
            disabled={!selectedFile || loading}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg shadow transition ${
              !selectedFile || loading
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-amber-700 hover:bg-amber-800 text-white active:scale-95'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>प्रोसेस हो रहा है...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>प्रश्न निकालें और परीक्षा शुरू करें</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
