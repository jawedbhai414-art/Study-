import React, { useState } from 'react';
import { X, Terminal, Globe, Smartphone, Check, Copy, ExternalLink, BookOpen } from 'lucide-react';

interface PublishGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishGuideModal: React.FC<PublishGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base font-heading">
              वेबसाइट को चलाने और पब्लिश (Publish) करने की सम्पूर्ण गाइड
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-stone-800 text-sm">
          {/* Section 1: Mobile usage */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-900 font-bold mb-1.5">
              <Smartphone className="w-4 h-4 text-amber-700" />
              <span>1. मोबाइल फोन पर कैसे उपयोग करें (How to use on Mobile)</span>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              यह वेबसाइट पूरी तरह से मोबाइल-फ्रेंडली और रेस्पॉन्सिव है। आप अपने एंड्रॉयड या आईफोन के क्रोम (Chrome) या सफारी ब्राउज़र में लिंक खोलें।
            </p>
            <ul className="text-xs text-amber-950/90 mt-2 space-y-1 list-disc list-inside">
              <li><strong>PDF अपलोड:</strong> अपने फोन से सीधे पिछले साल का मैट्रिक प्रश्न पत्र या गाइड बुक की फोटो खींचकर अपलोड करें।</li>
              <li><strong>ओएमआर शीट (OMR Sheet):</strong> फोन की स्क्रीन पर असली ओएमआर शीट के गोले (Bubbles) भरें।</li>
              <li><strong>होम स्क्रीन पर जोड़ें (Add to Home Screen):</strong> ब्राउज़र मेन्यू में 'Install App' या 'Add to Home Screen' दबाकर ऐप की तरह चलाएं।</li>
            </ul>
          </div>

          {/* Section 2: How to run locally */}
          <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
            <div className="flex items-center gap-2 text-stone-900 font-bold mb-2">
              <Terminal className="w-4 h-4 text-amber-700" />
              <span>2. लोकल कंप्यूटर पर कैसे चलाएं (How to Run Locally)</span>
            </div>
            <p className="text-xs text-stone-600 mb-3">
              Node.js (v18+) इंस्टॉल होने पर टर्मिनल में निम्न कमांड्स चलाएं:
            </p>

            <div className="space-y-2">
              <div>
                <p className="text-[11px] font-semibold text-stone-700">चरण 1: निर्भरताएँ (Dependencies) इंस्टॉल करें:</p>
                <div className="relative mt-1">
                  <pre className="bg-stone-900 text-amber-300 text-xs p-2.5 rounded-lg font-mono overflow-x-auto">
                    npm install
                  </pre>
                  <button
                    onClick={() => copyToClipboard('npm install', 1)}
                    className="absolute right-2 top-2 text-xs bg-stone-700 text-white p-1 rounded hover:bg-stone-600"
                  >
                    {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-stone-700">चरण 2: .env फ़ाइल में Gemini API Key डालें:</p>
                <div className="relative mt-1">
                  <pre className="bg-stone-900 text-amber-300 text-xs p-2.5 rounded-lg font-mono overflow-x-auto">
                    GEMINI_API_KEY="your-gemini-api-key-here"
                  </pre>
                  <button
                    onClick={() => copyToClipboard('GEMINI_API_KEY="your-gemini-api-key-here"', 2)}
                    className="absolute right-2 top-2 text-xs bg-stone-700 text-white p-1 rounded hover:bg-stone-600"
                  >
                    {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-stone-700">चरण 3: डेवलपमेंट सर्वर शुरू करें (Port 3000):</p>
                <div className="relative mt-1">
                  <pre className="bg-stone-900 text-amber-300 text-xs p-2.5 rounded-lg font-mono overflow-x-auto">
                    npm run dev
                  </pre>
                  <button
                    onClick={() => copyToClipboard('npm run dev', 3)}
                    className="absolute right-2 top-2 text-xs bg-stone-700 text-white p-1 rounded hover:bg-stone-600"
                  >
                    {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Publishing */}
          <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/50">
            <div className="flex items-center gap-2 text-stone-900 font-bold mb-2">
              <Globe className="w-4 h-4 text-emerald-700" />
              <span>3. इंटरनेट पर लाइव पब्लिश कैसे करें (How to Publish Online)</span>
            </div>
            <p className="text-xs text-stone-600 mb-3">
              चूंकि यह एक फुल-स्टैक ऐप (Express + Vite + Gemini OCR) है, आप इसे किसी भी क्लाउड प्लेटफॉर्म पर 5 मिनट में फ्री में डिप्लॉय कर सकते हैं:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-stone-200 rounded-lg shadow-2xs">
                <p className="font-bold text-stone-900">ऑप्शन A: Render / Railway / Google Cloud Run</p>
                <p className="text-stone-600 mt-1">
                  1. कोड को GitHub पर पुश करें।
                  <br />
                  2. 'New Web Service' चुनें।
                  <br />
                  3. Build Command: <code className="bg-stone-100 px-1 font-mono">npm run build</code>
                  <br />
                  4. Start Command: <code className="bg-stone-100 px-1 font-mono">npm start</code>
                  <br />
                  5. Environment Variable में <code className="bg-stone-100 px-1 font-mono">GEMINI_API_KEY</code> जोड़ें।
                </p>
              </div>

              <div className="p-3 bg-white border border-stone-200 rounded-lg shadow-2xs">
                <p className="font-bold text-stone-900">ऑप्शन B: Vercel / Netlify</p>
                <p className="text-stone-600 mt-1">
                  यदि आप सर्वरलेस फंक्शन्स का उपयोग कर रहे हैं:
                  <br />
                  1. <code className="bg-stone-100 px-1 font-mono">vercel</code> कमांड चलाएं।
                  <br />
                  2. Environment Variables में अपनी <code className="bg-stone-100 px-1 font-mono">GEMINI_API_KEY</code> जोड़ें।
                  <br />
                  3. आपका लाइव URL (<code className="bg-stone-100 px-1">.vercel.app</code>) तुरंत सक्रिय हो जाएगा।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-100 border-t border-stone-200 px-5 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-stone-800 hover:bg-stone-900 text-white rounded-lg shadow transition"
          >
            समझ गए (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
