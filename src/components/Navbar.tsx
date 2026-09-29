import React from 'react';
import {
  Wallet,
  Download,
  LogOut,
  LogIn,
} from 'lucide-react';

interface NavbarUser {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

interface NavbarProps {
  user: NavbarUser | null;
  onOpenDownloadModal: () => void;
  onSignIn: () => void;
  onLogOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenDownloadModal,
  onSignIn,
  onLogOut,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                My-new-Finance-tracker
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              ระบบจัดการรายรับรายจ่าย & วิเคราะห์ข้อมูลรายเดือน
            </p>
          </div>
        </div>

        {/* Actions & User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Download Code Button */}
          <button
            onClick={onOpenDownloadModal}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-700/50 hover:border-emerald-500 rounded-xl transition shadow-sm active:scale-95"
            title="ดาวน์โหลด Source Code ทั้งหมด"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">ดาวน์โหลดโค้ด (.zip)</span>
            <span className="sm:hidden">โค้ด</span>
          </button>

          {/* User Status / Login */}
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Avatar'}
                    className="w-8 h-8 rounded-full border border-slate-700 object-cover ring-2 ring-emerald-500/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-emerald-400">
                    {user.email ? user.email[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">
                    {user.displayName || 'ผู้ใช้งาน'}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                    {user.email}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogOut}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                title="ออกจากระบบ"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-600/25 transition active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>เข้าสู่ระบบด้วย Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
