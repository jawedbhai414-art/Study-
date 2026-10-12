import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck } from 'lucide-react';
import { CandidateInfo } from '../types/exam';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateInfo;
  onSave: (info: CandidateInfo) => void;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onSave,
}) => {
  const [formData, setFormData] = useState<CandidateInfo>(candidate);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800 to-red-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base font-heading">परीक्षार्थी विवरण (Candidate Details)</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-stone-600 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            यह विवरण परीक्षा समाप्ति के उपरांत आपकी आधिकारिक अंकतालिका (Marksheet) पर प्रदर्शित होगा।
          </p>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              परीक्षार्थी का नाम (Candidate's Name) *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
              placeholder="उदा. राहुल कुमार"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                रोल कोड (Roll Code) *
              </label>
              <input
                type="text"
                required
                value={formData.rollCode}
                onChange={(e) => setFormData({ ...formData, rollCode: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none font-mono"
                placeholder="31042"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                रोल नंबर (Roll No.) *
              </label>
              <input
                type="text"
                required
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none font-mono"
                placeholder="2500123"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              पंजीयन संख्या (Registration No.)
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none font-mono"
              placeholder="31042-00123-25"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              विद्यालय का नाम (School Name)
            </label>
            <input
              type="text"
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
              placeholder="राजकीय उच्च माध्यमिक विद्यालय, पटना"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow transition"
            >
              <UserCheck className="w-4 h-4" />
              विवरण सहेजें
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
