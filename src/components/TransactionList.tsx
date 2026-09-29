import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Edit2,
  Trash2,
  Calendar,
  FileSpreadsheet,
  Layers,
  Tag,
  CreditCard,
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { CATEGORY_COLOR_MAP } from '../constants/categories';

interface TransactionListProps {
  transactions: Transaction[];
  currentMonthKey: string;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  onOpenAddModal: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  currentMonthKey,
  onEdit,
  onDelete,
  onOpenAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Month filtering
  const monthTransactions = transactions.filter((t) => t.date.startsWith(currentMonthKey));

  // Available categories for dropdown filter
  const availableCategories = Array.from(new Set(monthTransactions.map((t) => t.category)));

  // Filtered items
  const filteredList = monthTransactions.filter((t) => {
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchCat = t.category.toLowerCase().includes(term);
      const matchNote = t.note?.toLowerCase().includes(term);
      const matchMethod = t.paymentMethod.toLowerCase().includes(term);
      if (!matchCat && !matchNote && !matchMethod) return false;
    }
    return true;
  });

  // Export CSV
  const handleExportCSV = () => {
    if (filteredList.length === 0) return;
    const headers = ['ID', 'วันที่', 'ประเภท', 'หมวดหมู่', 'จำนวนเงิน (บาท)', 'วิธีชำระ', 'บันทึก'];
    const rows = filteredList.map((t) => [
      t.id,
      t.date,
      t.type === 'income' ? 'รายรับ' : 'รายจ่าย',
      `"${t.category}"`,
      t.amount,
      `"${t.paymentMethod}"`,
      `"${(t.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${currentMonthKey}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-7 backdrop-blur-md space-y-5">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>รายการบันทึกทั้งหมด</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
              {filteredList.length} รายการ
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ประวัติการรับ-จ่ายในเดือนที่เลือก สามารถค้นหาและแก้ไขได้
          </p>
        </div>

        {filteredList.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition"
            title="ส่งออกไฟล์ Excel/CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>ส่งออก CSV</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาหมวดหมู่, บันทึกย่อ, วิธีชำระเงิน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="sm:col-span-3 flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setTypeFilter('all')}
            className={`flex-1 py-1.5 rounded-lg transition font-medium ${
              typeFilter === 'all'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setTypeFilter('income')}
            className={`flex-1 py-1.5 rounded-lg transition font-medium ${
              typeFilter === 'income'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            รายรับ
          </button>
          <button
            onClick={() => setTypeFilter('expense')}
            className={`flex-1 py-1.5 rounded-lg transition font-medium ${
              typeFilter === 'expense'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            รายจ่าย
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">ทุกหมวดหมู่ ({availableCategories.length})</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-2.5">
        {filteredList.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800">
            <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <div className="text-sm font-semibold text-slate-300">ไม่พบรายการบันทึกในเดือนนี้</div>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              ลองเปลี่ยนคำค้นหา หรือกดปุ่มด้านล่างเพื่อบันทึกรายรับหรือรายจ่ายรายการแรก
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition shadow-md shadow-emerald-500/20"
            >
              + บันทึกรายการใหม่
            </button>
          </div>
        ) : (
          filteredList.map((tx) => {
            const isIncome = tx.type === 'income';
            const catColor = CATEGORY_COLOR_MAP[tx.category] || (isIncome ? '#10b981' : '#f43f5e');

            return (
              <div
                key={tx.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-950/50 hover:bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition gap-3"
              >
                {/* Left: Icon, category, notes, method */}
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: `${catColor}25`, border: `1.5px solid ${catColor}50` }}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-rose-400" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-white">{tx.category}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center gap-1">
                        <CreditCard className="w-2.5 h-2.5" />
                        {tx.paymentMethod}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {tx.date}
                      </span>
                      {tx.note && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-300 italic">{tx.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 pl-13 sm:pl-0 border-t sm:border-t-0 border-slate-800/60 pt-2 sm:pt-0">
                  <div className="text-right">
                    <span
                      className={`text-base sm:text-lg font-bold tracking-tight ${
                        isIncome ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '-'}฿{tx.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-90 sm:opacity-40 group-hover:opacity-100 transition">
                    <button
                      onClick={() => onEdit(tx)}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition"
                      title="แก้ไขรายการ"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {confirmDeleteId === tx.id ? (
                      <div className="flex items-center gap-1 bg-rose-950/80 p-1 rounded-lg border border-rose-800">
                        <button
                          onClick={() => {
                            onDelete(tx.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2 py-0.5 text-[10px] font-bold text-rose-200 bg-rose-600 hover:bg-rose-500 rounded"
                        >
                          ลบจริง
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-1 text-[10px] text-slate-400 hover:text-white"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(tx.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                        title="ลบรายการ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
