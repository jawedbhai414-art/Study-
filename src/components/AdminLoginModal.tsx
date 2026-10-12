import React, { useState } from 'react';
import { X, ShieldCheck, Key, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { verifyAdminPin } from '../services/adminService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminAuthenticated: () => void;
  onGoogleSignIn: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAdminAuthenticated,
  onGoogleSignIn,
}) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPin(pin)) {
      setError(null);
      onAdminAuthenticated();
      onClose();
    } else {
      setError('अमान्य एडमिन पिन (Invalid Admin PIN)। कृपया सही पिन दर्ज करें।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base font-heading">
              मुख्य प्रशासक लॉगिन (Super Admin Login)
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
        <div className="p-5 space-y-4 text-stone-800 text-sm">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-950">
            <span className="font-bold">केवल मुख्य व्यवस्थापक के लिए: </span>
            यह पोर्टल <strong>jawedbhai414@gmail.com</strong> के संपूर्ण नियंत्रण में है। आप अपने Google खाते से या एडमिन पिन द्वारा लॉगिन कर सकते हैं।
          </div>

          {/* Option 1: Google login for owner */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-center space-y-2">
            <p className="text-xs font-semibold text-stone-700">विकल्प 1: अधिकृत Google खाते से लॉगिन करें</p>
            <button
              onClick={() => {
                onGoogleSignIn();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold py-2 rounded-lg text-xs shadow-xs transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <span>jawedbhai414@gmail.com से साइन इन</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-2 text-[11px] text-stone-400 font-bold uppercase absolute">या (OR)</span>
          </div>

          {/* Option 2: PIN Login */}
          <form onSubmit={handlePinSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                विकल्प 2: एडमिन सुरक्षा पिन (Admin PIN)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="एडमिन पिन दर्ज करें (Default: bseb@2025)"
                  className="w-full px-3 py-2 pl-9 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none font-mono"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                डिफ़ॉल्ट गुप्त पिन: <code className="bg-stone-100 px-1 py-0.5 rounded font-mono font-bold text-stone-800">bseb@2025</code> (एडमिन पैनल में बदला जा सकता है)
              </p>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 bg-amber-800 hover:bg-amber-900 text-white font-bold py-2 rounded-lg text-xs shadow transition active:scale-95"
            >
              <Key className="w-3.5 h-3.5 text-amber-300" />
              <span>एडमिन पैनल अनलॉक करें (Unlock Access)</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
