import React from 'react';
import {
  Wallet,
  LogIn,
  ShieldCheck,
  Sparkles,
  Download,
} from 'lucide-react';

interface LandingHeroProps {
  onSignIn: () => void;
  onContinueDemo: () => void;
  onOpenDownloadModal: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onSignIn,
  onContinueDemo,
  onOpenDownloadModal,
}) => {
  return (
    <div className="py-8 sm:py-16 space-y-12 max-w-5xl mx-auto px-4">
      {/* Hero Header */}
      <div className="text-center space-y-5">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
          ระบบจัดการรายรับรายจ่าย <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            สรุปผลรายเดือน & สร้างภาพวิเคราะห์ข้อมูล
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          บันทึกการเงินอย่างง่ายดาย ปลอดภัยด้วยการเข้าสู่ระบบผ่าน Gmail จัดเก็บข้อมูลบน Firebase Cloud
          แบบเรียลไทม์ พร้อมระบบสร้างภาพสรุปการเงินรายเดือนในคลิกเดียว
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 flex-wrap">
          <button
            onClick={onSignIn}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-2xl shadow-xl shadow-emerald-500/25 transition active:scale-95"
          >
            <LogIn className="w-5 h-5" />
            <span>เข้าสู่ระบบด้วย Gmail (Google)</span>
          </button>

          <button
            onClick={onContinueDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-700/60 hover:border-emerald-500 rounded-2xl transition shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>ทดลองใช้งานทันที (Demo)</span>
          </button>

          <button
            onClick={onOpenDownloadModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-2xl transition shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>ดาวน์โหลด Code ทั้งหมด (.zip)</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1 */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-3 hover:border-emerald-500/40 transition group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
            <Wallet className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">บันทึกรายรับ - รายจ่ายครบครัน</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            แยกหมวดหมู่ละเอียด พร้อมระบุวิธีชำระเงิน แนบบันทึกช่วยจำ และค้นหาย้อนหลังได้อย่างสะดวก
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-3 hover:border-indigo-500/40 transition group">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">สรุปผล & สร้างภาพวิเคราะห์</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            ดูสัดส่วนการใช้จ่ายแบบกราฟโดนัท แนวโน้มรายวัน พร้อมสร้างภาพ Infographic สำหรับบันทึกหรือแชร์
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm space-y-3 hover:border-teal-500/40 transition group">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-110 transition">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">คลาวด์ Firebase & Gmail ปลอดภัย</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            ข้อมูลส่วนบุคคลปลอดภัยด้วย Security Rules บันทึกแยกรายบัญชี ข้อมูลซิงค์ทุกอุปกรณ์ทันที
          </p>
        </div>
      </div>
    </div>
  );
};
