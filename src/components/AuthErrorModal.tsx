import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface AuthErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueDemo: () => void;
  projectId: string;
}

export const AuthErrorModal: React.FC<AuthErrorModalProps> = ({
  isOpen,
  onClose,
  onContinueDemo,
  projectId,
}) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const firebaseSettingsUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentHostname);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-600/40 rounded-3xl w-full max-w-lg shadow-2xl p-5 sm:p-7 space-y-5 text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                ต้องการเพิ่มโดเมนใน Firebase Console
              </h3>
              <p className="text-xs text-amber-300/90 font-medium">
                auth/unauthorized-domain (ความปลอดภัยของ Firebase)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explanation */}
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            เนื่องจากคุณเปลี่ยนไปใช้ Firebase Project ของคุณเอง (<strong>{projectId}</strong>)
            Firebase จึงต้องการให้ระบุโดเมนนี้ในรายการ <strong>Authorized Domains</strong>{' '}
            เพื่อความปลอดภัยในการเข้าสู่ระบบด้วย Google
          </p>

          {/* Current Domain Box */}
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <span className="text-[11px] text-slate-400">โดเมนของแอปนี้ที่ต้องคัดลอก:</span>
            <div className="flex items-center justify-between gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-emerald-400 font-mono text-[11px] break-all select-all">
              <span>{currentHostname}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>
          </div>

          {/* Steps */}
          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-1.5 text-[11px]">
            <span className="font-semibold text-slate-200">วิธีเพิ่มโดเมนใน 3 ขั้นตอน:</span>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
              <li>
                เปิด{' '}
                <a
                  href={firebaseSettingsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline inline-flex items-center gap-0.5"
                >
                  Firebase Console (Settings) <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>ไปที่แท็บ <strong>Settings</strong> &gt; หัวข้อ <strong>Authorized domains</strong></li>
              <li>กด <strong>Add domain</strong> แล้ววางโดเมนที่คัดลอกไว้ลงไป แล้วกดบันทึก</li>
            </ol>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onContinueDemo}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/60 rounded-xl transition"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>เข้าใช้งานโหมดทดลองทันที (Demo)</span>
          </button>

          <a
            href={firebaseSettingsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/25 transition"
          >
            <span>ไปที่ Firebase Console</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
