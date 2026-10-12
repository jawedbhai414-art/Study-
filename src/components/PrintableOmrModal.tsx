import React from 'react';
import { X, Printer, CheckCircle, Info, Download } from 'lucide-react';
import { CandidateInfo } from '../types/exam';

interface PrintableOmrModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateInfo;
}

export const PrintableOmrModal: React.FC<PrintableOmrModalProps> = ({
  isOpen,
  onClose,
  candidate,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // 100 questions split into 4 columns of 25 each
  const columns = [
    Array.from({ length: 25 }, (_, i) => i + 1),
    Array.from({ length: 25 }, (_, i) => i + 26),
    Array.from({ length: 25 }, (_, i) => i + 51),
    Array.from({ length: 25 }, (_, i) => i + 76),
  ];

  const sets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[96vh] rounded-3xl shadow-2xl flex flex-col border border-stone-300 overflow-hidden my-auto">
        {/* Top bar (Hidden when printed) */}
        <div className="print:hidden px-6 py-3.5 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-amber-400">
              📄 बिहार विद्यालय परीक्षा समिति - मॉडल OMR उत्तर-पत्रक (Printable A4 Sheet)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>A4 पर प्रिंट निकालें (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable OMR Sheet Container */}
        <div className="p-6 sm:p-8 overflow-y-auto grow bg-white text-stone-900 print:p-2 print:m-0 print:overflow-visible">
          {/* BSEB Header */}
          <div className="border-2 border-stone-800 p-4 rounded-xl text-center space-y-1 relative">
            <div className="text-[11px] font-bold text-stone-600 tracking-wider">
              BIHAR SCHOOL EXAMINATION BOARD, PATNA
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-serif tracking-wide text-stone-900">
              बिहार विद्यालय परीक्षा समिति, पटना
            </h1>
            <div className="text-xs font-bold bg-stone-100 py-1 px-3 rounded-md inline-block border border-stone-300">
              वार्षिक माध्यमिक (मैट्रिक) परीक्षा 2025-26 • OMR उत्तर पत्रक (OMR ANSWER SHEET)
            </div>
          </div>

          {/* Candidate Info Grid */}
          <div className="mt-3 border-2 border-stone-800 p-3 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-stone-500 font-bold block uppercase">
                परीक्षार्थी का नाम (Name):
              </span>
              <span className="font-bold text-stone-900 truncate block">
                {candidate.name || 'राहुल कुमार'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-bold block uppercase">
                रोल कोड (Roll Code):
              </span>
              <span className="font-mono font-bold text-stone-900">
                {candidate.rollCode || '11024'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-bold block uppercase">
                रोल नंबर (Roll No.):
              </span>
              <span className="font-mono font-bold text-stone-900">
                {candidate.rollNumber || '2500041'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-bold block uppercase">
                विषय कोड (Sub Code):
              </span>
              <span className="font-mono font-bold text-stone-900">
                112 (विज्ञान/गणित)
              </span>
            </div>
          </div>

          {/* Question Booklet Set Code selection */}
          <div className="mt-3 border-2 border-stone-800 p-2.5 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="font-bold text-stone-800">
              प्रश्न पुस्तिका सेट कोड (Question Booklet Set Code):
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {sets.map((s) => (
                <div key={s} className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-stone-700">{s}</span>
                  <div className="w-5 h-5 rounded-full border-2 border-stone-800 flex items-center justify-center font-bold text-[10px] text-stone-400">
                    {s === 'A' ? '●' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines Box */}
          <div className="mt-2.5 p-2 bg-stone-50 border border-stone-300 rounded-lg text-[10px] text-stone-700 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="font-bold">महत्वपूर्ण निर्देश: </span>
              केवल नीले या काले बॉल प्वाइंट पेन का प्रयोग करें। गोले को पूरा गहरा भरें।
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span>गलत तरीका: ✕ ✓ ◐</span>
              <span className="font-bold text-emerald-800">सही तरीका: ●</span>
            </div>
          </div>

          {/* 100 Bubbles Grid (4 Columns of 25) */}
          <div className="mt-3.5 border-2 border-stone-800 p-3 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-3 bg-white">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="space-y-1.5">
                <div className="text-[10px] font-bold text-center bg-stone-200 py-0.5 rounded border border-stone-300">
                  प्र. {col[0]} से {col[col.length - 1]}
                </div>
                {col.map((qNum) => (
                  <div
                    key={qNum}
                    className="flex items-center justify-between text-xs px-1 py-0.5 border-b border-stone-100"
                  >
                    <span className="font-mono font-bold text-stone-600 w-6 text-right pr-1">
                      {qNum}.
                    </span>
                    <div className="flex items-center gap-1.5">
                      {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                        <div
                          key={opt}
                          className="w-4.5 h-4.5 rounded-full border-1.5 border-stone-700 flex items-center justify-center text-[9px] font-bold text-stone-700 hover:bg-stone-900 hover:text-white transition cursor-pointer"
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Signatures Footer */}
          <div className="mt-4 pt-6 border-t-2 border-dashed border-stone-400 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="border-t border-stone-800 pt-1">
              <span className="font-bold text-stone-800 block">
                परीक्षार्थी का पूरा हस्ताक्षर
              </span>
              <span className="text-[10px] text-stone-500">
                (Candidate's Full Signature)
              </span>
            </div>
            <div className="border-t border-stone-800 pt-1">
              <span className="font-bold text-stone-800 block">
                वीक्षक का हस्ताक्षर (मुहर सहित)
              </span>
              <span className="text-[10px] text-stone-500">
                (Invigilator's Signature with Stamp)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
