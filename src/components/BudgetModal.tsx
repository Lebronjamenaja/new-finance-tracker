import React, { useState, useEffect } from 'react';
import { X, Target, PiggyBank, Check } from 'lucide-react';
import { MonthlyBudget } from '../types';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthKey: string;
  currentBudget: MonthlyBudget | null;
  onSave: (monthKey: string, budgetLimit: number, savingsTarget: number, notes?: string) => Promise<void>;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  monthKey,
  currentBudget,
  onSave,
}) => {
  const [budgetLimit, setBudgetLimit] = useState<string>('');
  const [savingsTarget, setSavingsTarget] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (currentBudget) {
      setBudgetLimit(currentBudget.budgetLimit ? currentBudget.budgetLimit.toString() : '');
      setSavingsTarget(currentBudget.savingsTarget ? currentBudget.savingsTarget.toString() : '');
      setNotes(currentBudget.notes || '');
    } else {
      setBudgetLimit('25000');
      setSavingsTarget('10000');
      setNotes('');
    }
    setErrorMsg('');
  }, [currentBudget, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(budgetLimit) || 0;
    const target = parseFloat(savingsTarget) || 0;

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onSave(monthKey, limit, target, notes);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg('เกิดข้อผิดพลาดในการบันทึกงบประมาณ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">ตั้งงบประมาณรายเดือน</h3>
              <p className="text-xs text-slate-400">ประจำเดือน {monthKey}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 text-xs text-rose-300 bg-rose-950/60 border border-rose-800/80 rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              เพดานงบประมาณรายจ่าย (บาท)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                ฿
              </span>
              <input
                type="number"
                step="any"
                placeholder="25000"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-base font-bold bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              แอปจะคำนวณแถบความคืบหน้าแจ้งเตือนเมื่อคุณใช้จ่ายใกล้ถึงเพดาน
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              เป้าหมายเงินออมในเดือนนี้ (บาท)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                ฿
              </span>
              <input
                type="number"
                step="any"
                placeholder="10000"
                value={savingsTarget}
                onChange={(e) => setSavingsTarget(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-base font-bold bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              บันทึกเป้าหมายเพิ่มเติม (ไม่บังคับ)
            </label>
            <input
              type="text"
              placeholder="เช่น เก็บเงินไว้เที่ยวดอยช่วงปีใหม่"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg shadow-purple-600/25 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>กำลังบันทึก...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>บันทึกงบประมาณ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
