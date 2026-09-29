export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'เงินสด' | 'โอนเงิน/พร้อมเพย์' | 'บัตรเครดิต' | 'กระเป๋าเงินดิจิทัล' | 'อื่นๆ';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface MonthlyBudget {
  id: string;
  userId: string;
  monthKey: string; // YYYY-MM
  budgetLimit: number;
  savingsTarget: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  currency: string;
  createdAt: string;
  updatedAt?: string;
}
