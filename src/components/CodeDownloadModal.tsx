import React, { useState } from 'react';
import {
  X,
  Download,
  FolderArchive,
  CheckCircle2,
  FileCode,
  Terminal,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { downloadAllProjectCode } from '../utils/codeDownloader';

interface CodeDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeDownloadModal: React.FC<CodeDownloadModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadComplete(false);
    try {
      await downloadAllProjectCode();
      setDownloadComplete(true);
      setTimeout(() => setDownloadComplete(false), 5000);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-5 sm:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-sm">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                ดาวน์โหลด Source Code ทั้งหมด
              </h3>
              <p className="text-xs text-slate-400">
                รวมไฟล์ต้นฉบับทั้งโปรเจกต์ในรูปแบบ .ZIP สามารถนำไปรันต่อได้ทันที
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

        {/* Content Details */}
        <div className="space-y-3.5">
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2 text-xs text-slate-300">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>ไฟล์และส่วนประกอบที่รวมอยู่ใน ZIP:</span>
            </div>
            <ul className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-400 pl-1">
              <li>• โค้ดระบบหลัก (App, Main, Types)</li>
              <li>• Firebase Auth & Firestore Client</li>
              <li>• ระบบสรุปและส่งออกภาพวิเคราะห์</li>
              <li>• Security Rules & Blueprint</li>
              <li>• Tailwind CSS 4 & UI Components</li>
              <li>• เอกสารแนะนำติดตั้ง (README.md)</li>
            </ul>
          </div>

          {/* Quick instructions box */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2 text-xs text-slate-300">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>คำสั่งเริ่มใช้งานหลังแตกไฟล์ (Local Setup):</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl font-mono text-[11px] text-emerald-400 border border-slate-800 select-all">
              npm install <br />
              npm run dev
            </div>
          </div>

          {downloadComplete && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-800/80 rounded-2xl flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ดาวน์โหลดไฟล์ .ZIP เรียบร้อยแล้ว! เช็คโฟลเดอร์ Downloads ในเครื่องของคุณ</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition"
          >
            ปิด
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-lg shadow-emerald-500/25 transition disabled:opacity-50 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'กำลังบีบอัดไฟล์ ZIP...' : 'ดาวน์โหลด ZIP (.zip)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
