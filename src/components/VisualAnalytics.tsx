import React, { useState, useRef } from 'react';
import {
  PieChart,
  BarChart3,
  Sparkles,
  Download,
  Calendar,
  Share2,
  CheckCircle,
  Copy,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { Transaction, MonthlyBudget } from '../types';
import { CATEGORY_COLOR_MAP } from '../constants/categories';

interface VisualAnalyticsProps {
  currentMonthKey: string;
  transactions: Transaction[];
  budget: MonthlyBudget | null;
  userName: string;
  userEmail: string;
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

export const VisualAnalytics: React.FC<VisualAnalyticsProps> = ({
  currentMonthKey,
  transactions,
  budget,
  userName,
  userEmail,
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'daily' | 'compare'>('categories');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [yearStr, monthStr] = currentMonthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const monthLabel = `${THAI_MONTHS[month - 1]} ${year + 543}`;

  // Filter transactions for this month
  const monthTransactions = transactions.filter((t) => t.date.startsWith(currentMonthKey));

  const totalIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netBalance / totalIncome) * 100)) : 0;

  // Category Breakdown for expenses
  const expenseByCategory: Record<string, number> = {};
  monthTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

  const sortedCategories = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);

  // Daily Spending Trend
  const daysInMonth = new Date(year, month, 0).getDate();
  const dailySpending: { day: number; amount: number }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = `${currentMonthKey}-${String(d).padStart(2, '0')}`;
    const dayExpense = monthTransactions
      .filter((t) => t.type === 'expense' && t.date === dayStr)
      .reduce((sum, t) => sum + t.amount, 0);
    dailySpending.push({ day: d, amount: dayExpense });
  }

  const maxDailyExpense = Math.max(...dailySpending.map((d) => d.amount), 100);

  // Generate and Download Canvas Image
  const handleGenerateAndDownloadImage = async () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1200;
      const height = 1500;
      canvas.width = width;
      canvas.height = height;

      // 1. Dark Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#020617'); // slate-950
      bgGrad.addColorStop(0.5, '#0f172a'); // slate-900
      bgGrad.addColorStop(1, '#022c22'); // dark emerald tint
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle ambient lights
      const glow1 = ctx.createRadialGradient(200, 200, 10, 200, 200, 450);
      glow1.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
      glow1.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);

      const glow2 = ctx.createRadialGradient(1000, 800, 20, 1000, 800, 500);
      glow2.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
      glow2.addColorStop(1, 'rgba(99, 102, 241, 0)');
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, width, height);

      // Decorative Border Card
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
      ctx.lineWidth = 3;
      ctx.roundRect(40, 40, width - 80, height - 80, 36);
      ctx.stroke();

      // Top Header
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 36px "Prompt", sans-serif';
      ctx.fillText('My-new-Finance-tracker', 80, 110);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px "Prompt", sans-serif';
      ctx.fillText('สรุปภาพรวมรายรับรายจ่ายประจำเดือน', 80, 150);

      // Month & User Badges
      // Badge 1: Month
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 2;
      ctx.roundRect(width - 420, 75, 340, 60, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 26px "Prompt", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`เดือน ${monthLabel}`, width - 250, 114);
      ctx.textAlign = 'left';

      // Divider
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 190);
      ctx.lineTo(width - 80, 190);
      ctx.stroke();

      // User Info Box
      ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
      ctx.roundRect(80, 220, width - 160, 80, 20);
      ctx.fill();
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 26px "Prompt", sans-serif';
      ctx.fillText(`ผู้ใช้งาน: ${userName || 'คุณลูกค้า'}`, 110, 268);

      ctx.fillStyle = '#64748b';
      ctx.font = '20px "Prompt", sans-serif';
      ctx.fillText(userEmail || 'บัญชี Google ที่ปลอดภัย', width - 480, 268);

      // 3 Stat Big Metric Cards
      const cardY = 330;
      const cardHeight = 180;
      const cardWidth = 320;
      const gap = 30;

      // Card 1: Income
      ctx.fillStyle = 'rgba(6, 78, 59, 0.35)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.roundRect(80, cardY, cardWidth, cardHeight, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#6ee7b7';
      ctx.font = '22px "Prompt", sans-serif';
      ctx.fillText('รายรับรวม (Income)', 105, cardY + 45);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px "Prompt", sans-serif';
      ctx.fillText(`฿${totalIncome.toLocaleString()}`, 105, cardY + 115);

      // Card 2: Expense
      const card2X = 80 + cardWidth + gap;
      ctx.fillStyle = 'rgba(136, 19, 55, 0.35)';
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.5)';
      ctx.roundRect(card2X, cardY, cardWidth, cardHeight, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fda4af';
      ctx.font = '22px "Prompt", sans-serif';
      ctx.fillText('รายจ่ายรวม (Expense)', card2X + 25, cardY + 45);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px "Prompt", sans-serif';
      ctx.fillText(`฿${totalExpense.toLocaleString()}`, card2X + 25, cardY + 115);

      // Card 3: Net Balance
      const card3X = card2X + cardWidth + gap;
      ctx.fillStyle = netBalance >= 0 ? 'rgba(30, 58, 138, 0.35)' : 'rgba(120, 53, 15, 0.35)';
      ctx.strokeStyle = netBalance >= 0 ? 'rgba(59, 130, 246, 0.5)' : 'rgba(245, 158, 11, 0.5)';
      ctx.roundRect(card3X, cardY, cardWidth, cardHeight, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = netBalance >= 0 ? '#93c5fd' : '#fcd34d';
      ctx.font = '22px "Prompt", sans-serif';
      ctx.fillText('ยอดคงเหลือสุทธิ (Net)', card3X + 25, cardY + 45);

      ctx.fillStyle = netBalance >= 0 ? '#38bdf8' : '#fbbf24';
      ctx.font = 'bold 44px "Prompt", sans-serif';
      ctx.fillText(`${netBalance < 0 ? '-' : ''}฿${Math.abs(netBalance).toLocaleString()}`, card3X + 25, cardY + 115);

      // Category Section Title
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 30px "Prompt", sans-serif';
      ctx.fillText('สัดส่วนรายจ่ายแยกตามหมวดหมู่ (Expense Breakdown)', 80, 560);

      // Draw Donut Chart on Left
      const donutCenterX = 300;
      const donutCenterY = 760;
      const radiusOuter = 160;
      const radiusInner = 95;

      let startAngle = -Math.PI / 2;

      if (sortedCategories.length === 0 || totalExpense === 0) {
        ctx.beginPath();
        ctx.arc(donutCenterX, donutCenterY, radiusOuter, 0, Math.PI * 2);
        ctx.fillStyle = '#334155';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(donutCenterX, donutCenterY, radiusInner, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
      } else {
        sortedCategories.forEach(([catName, amt]) => {
          const sliceAngle = (amt / totalExpense) * Math.PI * 2;
          const endAngle = startAngle + sliceAngle;
          const color = CATEGORY_COLOR_MAP[catName] || '#64748b';

          ctx.beginPath();
          ctx.arc(donutCenterX, donutCenterY, radiusOuter, startAngle, endAngle);
          ctx.arc(donutCenterX, donutCenterY, radiusInner, endAngle, startAngle, true);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();

          startAngle = endAngle;
        });
      }

      // Center Donut text
      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px "Prompt", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('รวมรายจ่าย', donutCenterX, donutCenterY - 10);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px "Prompt", sans-serif';
      ctx.fillText(`฿${totalExpense.toLocaleString()}`, donutCenterX, donutCenterY + 30);
      ctx.textAlign = 'left';

      // Top Category Items on Right
      const listStartX = 540;
      const listStartY = 620;
      const topItems = sortedCategories.slice(0, 6);

      topItems.forEach(([catName, amt], idx) => {
        const itemY = listStartY + idx * 56;
        const color = CATEGORY_COLOR_MAP[catName] || '#64748b';
        const percent = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;

        // Color bullet
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(listStartX + 12, itemY + 8, 10, 0, Math.PI * 2);
        ctx.fill();

        // Category name
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '22px "Prompt", sans-serif';
        ctx.fillText(catName, listStartX + 35, itemY + 16);

        // Amount & percent
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 22px "Prompt", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`฿${amt.toLocaleString()} (${percent}%)`, width - 90, itemY + 16);
        ctx.textAlign = 'left';

        // Underline progress bar
        ctx.fillStyle = 'rgba(51, 65, 85, 0.5)';
        ctx.roundRect(listStartX + 35, itemY + 28, width - listStartX - 125, 6, 3);
        ctx.fill();

        ctx.fillStyle = color;
        ctx.roundRect(listStartX + 35, itemY + 28, ((width - listStartX - 125) * percent) / 100, 6, 3);
        ctx.fill();
      });

      if (topItems.length === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '24px "Prompt", sans-serif';
        ctx.fillText('ยังไม่มีรายการรายจ่ายในเดือนนี้', listStartX + 35, listStartY + 50);
      }

      // Financial Health & Budget Section
      const bottomY = 1000;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.7)';
      ctx.roundRect(80, bottomY, width - 160, 340, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 26px "Prompt", sans-serif';
      ctx.fillText('สรุปสุขภาพทางการเงิน & วินัยการออม', 110, bottomY + 50);

      // Financial status text
      const statusTitle =
        netBalance > 0
          ? `ยอดเยี่ยม! อัตราการออม ${savingsRate}% ของรายรับ`
          : netBalance === 0
          ? 'สมดุลพอดี (ไม่มีเงินออมเพิ่มขึ้น)'
          : 'ควรระวัง: รายจ่ายมากกว่ารายรับในเดือนนี้';

      const statusColor = netBalance > 0 ? '#10b981' : netBalance === 0 ? '#f59e0b' : '#ef4444';

      ctx.fillStyle = statusColor;
      ctx.font = 'bold 24px "Prompt", sans-serif';
      ctx.fillText(`• ${statusTitle}`, 110, bottomY + 105);

      // Budget info
      const budgetLimit = budget?.budgetLimit || 0;
      if (budgetLimit > 0) {
        const remaining = budgetLimit - totalExpense;
        const usedPercent = Math.round((totalExpense / budgetLimit) * 100);
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '22px "Prompt", sans-serif';
        ctx.fillText(
          `• งบประมาณเดือนนี้: ฿${budgetLimit.toLocaleString()} | ใช้ไป: ฿${totalExpense.toLocaleString()} (${usedPercent}%)`,
          110,
          bottomY + 155
        );
        ctx.fillText(
          `• สถานะงบประมาณ: ${remaining >= 0 ? `เหลือใช้อีก ฿${remaining.toLocaleString()}` : `ใช้เกินงบประมาณไป ฿${Math.abs(remaining).toLocaleString()}`}`,
          110,
          bottomY + 200
        );
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '22px "Prompt", sans-serif';
        ctx.fillText('• ยังไม่ได้กำหนดเพดานงบประมาณ สามารถกำหนดได้ที่หน้าหลักของแอป', 110, bottomY + 155);
      }

      ctx.fillStyle = '#64748b';
      ctx.font = '18px "Prompt", sans-serif';
      ctx.fillText(
        `บันทึกข้อมูลแบบเรียลไทม์ผ่าน Firebase Cloud Firestore • ออกรายงานเมื่อ ${new Date().toLocaleDateString('th-TH', { dateStyle: 'long' })}`,
        110,
        bottomY + 290
      );

      // Footer brand note
      ctx.fillStyle = '#475569';
      ctx.font = '18px "Prompt", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Generated by My-new-Finance-tracker • Secure Personal Cloud Platform', width / 2, height - 35);
      ctx.textAlign = 'left';

      // Export as PNG
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Finance-Summary-${currentMonthKey}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error exporting image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopySummaryText = () => {
    const text = `📊 สรุปรายงานการเงินประจำเดือน ${monthLabel}
👤 ผู้ใช้งาน: ${userName}
💰 รายรับรวม: ฿${totalIncome.toLocaleString()}
💸 รายจ่ายรวม: ฿${totalExpense.toLocaleString()}
💵 ยอดคงเหลือสุทธิ: ฿${netBalance.toLocaleString()}
📈 อัตราการออม: ${savingsRate}%
${budget?.budgetLimit ? `🎯 งบประมาณ: ฿${budget.budgetLimit.toLocaleString()} (คงเหลือ ฿${Math.max(0, budget.budgetLimit - totalExpense).toLocaleString()})` : ''}

บันทึกผ่านแอป My-new-Finance-tracker`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-7 backdrop-blur-md space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              ภาพวิเคราะห์ข้อมูล & สถิติรายเดือน
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            วิเคราะห์พฤติกรรมการใช้จ่ายและสร้างภาพ Infographic สำหรับบันทึกหรือแชร์
          </p>
        </div>

        {/* Tab Switcher & Export Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'categories'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              สัดส่วนหมวดหมู่
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'daily'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              แนวโน้มรายวัน
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'compare'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              เปรียบเทียบ รับ-จ่าย
            </button>
          </div>

          <button
            onClick={handleCopySummaryText}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl border border-slate-700 transition"
            title="คัดลอกข้อความสรุป"
          >
            {copiedText ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>คัดลอกสรุป</span>
              </>
            )}
          </button>

          <button
            onClick={handleGenerateAndDownloadImage}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 transition active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>{isExporting ? 'กำลังสร้างภาพ...' : 'บันทึกภาพสรุป (PNG)'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Categories Breakdown */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Interactive Donut Graphic */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-950/40 rounded-2xl border border-slate-800/80">
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="14"
                />
                {/* Slices */}
                {totalExpense > 0 &&
                  (() => {
                    let cumulativePercent = 0;
                    return sortedCategories.map(([catName, amt]) => {
                      const percent = (amt / totalExpense) * 100;
                      const strokeDasharray = `${(percent * 251.2) / 100} 251.2`;
                      const strokeDashoffset = -((cumulativePercent * 251.2) / 100);
                      cumulativePercent += percent;
                      const color = CATEGORY_COLOR_MAP[catName] || '#64748b';

                      return (
                        <circle
                          key={catName}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          stroke={color}
                          strokeWidth="14"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-500 hover:stroke-width-16"
                        />
                      );
                    });
                  })()}
              </svg>
              {/* Donut Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-medium text-slate-400">รวมรายจ่าย</span>
                <span className="text-xl font-extrabold text-white">
                  ฿{totalExpense.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  {sortedCategories.length} หมวดหมู่
                </span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs text-slate-400">
                รายจ่ายสูงสุด:{' '}
                <strong className="text-emerald-400">
                  {sortedCategories[0] ? sortedCategories[0][0] : '-'}
                </strong>
              </span>
            </div>
          </div>

          {/* Category Progress Bars */}
          <div className="lg:col-span-7 space-y-3.5">
            {sortedCategories.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">
                ยังไม่มีรายการรายจ่ายในเดือนนี้
              </div>
            ) : (
              sortedCategories.map(([catName, amt]) => {
                const percent = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
                const color = CATEGORY_COLOR_MAP[catName] || '#64748b';

                return (
                  <div key={catName} className="group">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-medium text-slate-200">{catName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">฿{amt.toLocaleString()}</span>
                        <span className="text-slate-400 text-[11px]">({percent}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-950/80 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-500 group-hover:brightness-125"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Daily Spending Trend */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>แท่งแสดงยอดใช้จ่ายในแต่ละวันของเดือน (1 - {daysInMonth})</span>
            <span>ยอดสูงสุดวันเดียว: ฿{maxDailyExpense.toLocaleString()}</span>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 overflow-x-auto">
            <div className="min-w-[650px] h-48 flex items-end gap-1.5 pt-6 pb-2">
              {dailySpending.map(({ day, amount }) => {
                const heightPercent = maxDailyExpense > 0 ? (amount / maxDailyExpense) * 100 : 0;
                const hasExpense = amount > 0;

                return (
                  <div
                    key={day}
                    className="flex-1 flex flex-col items-center gap-1.5 group relative"
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-20 border border-slate-700">
                      วันที่ {day}: ฿{amount.toLocaleString()}
                    </div>

                    {/* Bar */}
                    <div className="w-full bg-slate-800/40 rounded-t h-36 flex items-end">
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          hasExpense
                            ? 'bg-gradient-to-t from-indigo-600 to-teal-400 group-hover:brightness-125'
                            : 'bg-transparent'
                        }`}
                        style={{ height: `${Math.max(hasExpense ? 6 : 0, heightPercent)}%` }}
                      />
                    </div>
                    {/* Day Number */}
                    <span className="text-[10px] text-slate-500 group-hover:text-slate-200">
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Compare Income vs Expense */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400">รายรับ (Income)</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-2">฿{totalIncome.toLocaleString()}</div>
              <div className="mt-4 w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{
                    width: `${totalIncome + totalExpense > 0 ? (totalIncome / (totalIncome + totalExpense)) * 100 : 50}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-5 bg-rose-950/20 border border-rose-900/40 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-400">รายจ่าย (Expense)</span>
                <TrendingDown className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-2">฿{totalExpense.toLocaleString()}</div>
              <div className="mt-4 w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-400 rounded-full"
                  style={{
                    width: `${totalIncome + totalExpense > 0 ? (totalExpense / (totalIncome + totalExpense)) * 100 : 50}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Savings Ratio Highlight */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-white">อัตราการออมเงิน (Savings Rate)</div>
              <div className="text-xs text-slate-400 mt-0.5">
                เปอร์เซ็นต์ของรายรับที่สามารถเก็บเป็นเงินออมได้หลังหักค่าใช้จ่ายทั้งหมด
              </div>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-black ${savingsRate >= 20 ? 'text-emerald-400' : savingsRate > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                {savingsRate}%
              </span>
              <div className="text-[11px] text-slate-400">
                {savingsRate >= 20 ? 'สุขภาพการเงินดีเยี่ยม' : savingsRate > 0 ? 'อยู่ในเกณฑ์ทั่วไป' : 'ไม่มีเงินออมเพิ่ม'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
