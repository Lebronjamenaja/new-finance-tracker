import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  PlusCircle,
  Sparkles,
  Sliders,
  Calendar,
} from 'lucide-react';
import { Transaction, MonthlyBudget } from '../types';

interface MonthlySummaryProps {
  currentMonthKey: string; // YYYY-MM
  onMonthChange: (newMonthKey: string) => void;
  transactions: Transaction[];
  budget: MonthlyBudget | null;
  onOpenAddModal: () => void;
  onOpenBudgetModal: () => void;
  onOpenExportModal: () => void;
  onSeedDemo: () => void;
}

const THAI_MONTHS = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

export const MonthlySummary: React.FC<MonthlySummaryProps> = ({
  currentMonthKey,
  onMonthChange,
  transactions,
  budget,
  onOpenAddModal,
  onOpenBudgetModal,
  onOpenExportModal,
  onSeedDemo,
}) => {
  const [yearStr, monthStr] = currentMonthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  // Month navigation
  const handlePrevMonth = () => {
    let newYear = year;
    let newMonth = month - 1;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    onMonthChange(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    let newYear = year;
    let newMonth = month + 1;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    onMonthChange(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    onMonthChange(`${y}-${m}`);
  };

  // Filter transactions for current month
  const monthTransactions = transactions.filter((t) => t.date.startsWith(currentMonthKey));

  const totalIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netBalance / totalIncome) * 100)) : 0;

  // Budget calculations
  const budgetLimit = budget?.budgetLimit || 0;
  const budgetRemaining = budgetLimit > 0 ? budgetLimit - totalExpense : 0;
  const budgetPercentUsed = budgetLimit > 0 ? Math.min(100, Math.round((totalExpense / budgetLimit) * 100)) : 0;

  const monthLabel = `${THAI_MONTHS[month - 1]} ${year + 543} (${year})`;

  return (
    <div className="space-y-6">
      {/* Month Selector Bar & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 p-3 sm:p-4 rounded-2xl backdrop-blur-sm">
        {/* Navigation */}
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="เดือนก่อนหน้า"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-3 py-1 flex items-center gap-2 text-sm sm:text-base font-bold text-white min-w-[170px] justify-center text-center">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>{monthLabel}</span>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="เดือนถัดไป"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleCurrentMonth}
            className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 rounded-xl border border-slate-800 transition"
          >
            เดือนปัจจุบัน
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {transactions.length === 0 && (
            <button
              onClick={onSeedDemo}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/50 rounded-xl transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ใส่ข้อมูลตัวอย่าง</span>
            </button>
          )}

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/50 hover:border-indigo-600 rounded-xl transition active:scale-95 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>สร้างภาพวิเคราะห์ข้อมูล</span>
          </button>

          <button
            onClick={onOpenBudgetModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition active:scale-95"
            title="กำหนดเป้าหมายงบประมาณรายจ่าย"
          >
            <Sliders className="w-4 h-4 text-slate-400" />
            <span>ตั้งงบประมาณ</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-lg shadow-emerald-500/25 transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>บันทึกรายการ</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income Card */}
        <div className="relative overflow-hidden bg-slate-900/80 border border-emerald-900/40 rounded-2xl p-5 shadow-lg shadow-emerald-950/20 group hover:border-emerald-500/40 transition">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">รายรับทั้งหมด</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            ฿{totalIncome.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-emerald-400/80 flex items-center gap-1">
            <span>{monthTransactions.filter((t) => t.type === 'income').length} รายการรับ</span>
          </div>
        </div>

        {/* Expense Card */}
        <div className="relative overflow-hidden bg-slate-900/80 border border-rose-900/40 rounded-2xl p-5 shadow-lg shadow-rose-950/20 group hover:border-rose-500/40 transition">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-500/20 transition" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">รายจ่ายทั้งหมด</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            ฿{totalExpense.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-rose-400/80 flex items-center gap-1">
            <span>{monthTransactions.filter((t) => t.type === 'expense').length} รายการจ่าย</span>
          </div>
        </div>

        {/* Net Balance Card */}
        <div className="relative overflow-hidden bg-slate-900/80 border border-blue-900/40 rounded-2xl p-5 shadow-lg shadow-blue-950/20 group hover:border-blue-500/40 transition">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">ยอดคงเหลือสุทธิ</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${netBalance >= 0 ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400' : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'}`}>
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-2xl font-black tracking-tight ${netBalance >= 0 ? 'text-white' : 'text-amber-400'}`}>
            {netBalance < 0 ? '-' : ''}฿{Math.abs(netBalance).toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span>อัตราการออม {savingsRate}%</span>
            {netBalance >= 0 ? (
              <span className="text-emerald-400 font-medium">(มีสภาพคล่อง)</span>
            ) : (
              <span className="text-rose-400 font-medium">(รายจ่ายเกินรายรับ)</span>
            )}
          </div>
        </div>

        {/* Budget Progress Card */}
        <div className="relative overflow-hidden bg-slate-900/80 border border-purple-900/40 rounded-2xl p-5 shadow-lg shadow-purple-950/20 group hover:border-purple-500/40 transition">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/20 transition" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">การควบคุมงบประมาณ</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Target className="w-5 h-5" />
            </div>
          </div>
          {budgetLimit > 0 ? (
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-2xl font-black text-white tracking-tight">
                  {budgetPercentUsed}%
                </span>
                <span className="text-xs text-slate-400">
                  คงเหลือ ฿{Math.max(0, budgetRemaining).toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    budgetPercentUsed > 90
                      ? 'bg-rose-500'
                      : budgetPercentUsed > 70
                      ? 'bg-amber-400'
                      : 'bg-gradient-to-r from-purple-500 to-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, budgetPercentUsed)}%` }}
                />
              </div>
              <div className="mt-2 text-[10px] text-slate-400">
                งบประมาณตั้งไว้: ฿{budgetLimit.toLocaleString()}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm font-semibold text-slate-300 mt-1">ยังไม่ได้ตั้งงบ</div>
              <p className="text-[11px] text-slate-500 mt-1 mb-2">กำหนดเพดานรายจ่ายเพื่อฝึกวินัยการเงิน</p>
              <button
                onClick={onOpenBudgetModal}
                className="text-xs font-medium text-purple-400 hover:text-purple-300 underline"
              >
                + ตั้งเป้าหมายตอนนี้
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
