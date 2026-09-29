import { CategoryItem } from '../types';

export const DEFAULT_EXPENSE_CATEGORIES: CategoryItem[] = [
  { id: 'food', name: 'อาหารและเครื่องดื่ม', type: 'expense', icon: 'Utensils', color: '#f97316' },
  { id: 'transport', name: 'การเดินทาง / ค่าน้ำมัน', type: 'expense', icon: 'Car', color: '#06b6d4' },
  { id: 'shopping', name: 'ช้อปปิ้ง / ของใช้', type: 'expense', icon: 'ShoppingBag', color: '#ec4899' },
  { id: 'housing', name: 'ค่าที่พัก / ค่าเช่า', type: 'expense', icon: 'Home', color: '#8b5cf6' },
  { id: 'bills', name: 'ค่าน้ำ ค่าไฟ อินเทอร์เน็ต', type: 'expense', icon: 'Zap', color: '#eab308' },
  { id: 'health', name: 'สุขภาพ / ยารักษาโรค', type: 'expense', icon: 'HeartPulse', color: '#ef4444' },
  { id: 'entertainment', name: 'บันเทิง / ท่องเที่ยว', type: 'expense', icon: 'Film', color: '#a855f7' },
  { id: 'education', name: 'การศึกษา / หนังสือ', type: 'expense', icon: 'BookOpen', color: '#3b82f6' },
  { id: 'family', name: 'ครอบครัว / ให้พ่อแม่', type: 'expense', icon: 'Users', color: '#10b981' },
  { id: 'other_exp', name: 'รายจ่ายอื่นๆ', type: 'expense', icon: 'MoreHorizontal', color: '#64748b' },
];

export const DEFAULT_INCOME_CATEGORIES: CategoryItem[] = [
  { id: 'salary', name: 'เงินเดือน / ค่าจ้าง', type: 'income', icon: 'Briefcase', color: '#10b981' },
  { id: 'bonus', name: 'โบนัส / ค่าคอมมิชชัน', type: 'income', icon: 'Award', color: '#3b82f6' },
  { id: 'freelance', name: 'ฟรีแลนซ์ / งานเสริม', type: 'income', icon: 'Laptop', color: '#06b6d4' },
  { id: 'investment', name: 'เงินปันผล / กำไรลงทุน', type: 'income', icon: 'TrendingUp', color: '#8b5cf6' },
  { id: 'gift', name: 'ของขวัญ / ถูกรางวัล', type: 'income', icon: 'Gift', color: '#f59e0b' },
  { id: 'other_inc', name: 'รายรับอื่นๆ', type: 'income', icon: 'DollarSign', color: '#64748b' },
];

export const PAYMENT_METHODS = [
  'เงินสด',
  'โอนเงิน/พร้อมเพย์',
  'บัตรเครดิต',
  'กระเป๋าเงินดิจิทัล',
  'อื่นๆ',
] as const;

export const CATEGORY_COLOR_MAP: Record<string, string> = {
  'อาหารและเครื่องดื่ม': '#f97316',
  'การเดินทาง / ค่าน้ำมัน': '#06b6d4',
  'ช้อปปิ้ง / ของใช้': '#ec4899',
  'ค่าที่พัก / ค่าเช่า': '#8b5cf6',
  'ค่าน้ำ ค่าไฟ อินเทอร์เน็ต': '#eab308',
  'สุขภาพ / ยารักษาโรค': '#ef4444',
  'บันเทิง / ท่องเที่ยว': '#a855f7',
  'การศึกษา / หนังสือ': '#3b82f6',
  'ครอบครัว / ให้พ่อแม่': '#10b981',
  'รายจ่ายอื่นๆ': '#64748b',
  'เงินเดือน / ค่าจ้าง': '#10b981',
  'โบนัส / ค่าคอมมิชชัน': '#3b82f6',
  'ฟรีแลนซ์ / งานเสริม': '#06b6d4',
  'เงินปันผล / กำไรลงทุน': '#8b5cf6',
  'ของขวัญ / ถูกรางวัล': '#f59e0b',
  'รายรับอื่นๆ': '#64748b',
};
