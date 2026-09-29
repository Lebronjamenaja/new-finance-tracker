import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, testConnection, signInWithGoogle, logOut } from './lib/firebase';
import { Transaction, MonthlyBudget } from './types';
import firebaseConfig from '../firebase-applet-config.json';
import {
  syncUserProfile,
  subscribeTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  subscribeMonthlyBudget,
  saveMonthlyBudget,
  seedDemoTransactions,
} from './services/financeService';
import { Navbar } from './components/Navbar';
import { MonthlySummary } from './components/MonthlySummary';
import { VisualAnalytics } from './components/VisualAnalytics';
import { TransactionList } from './components/TransactionList';
import { TransactionModal } from './components/TransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { CodeDownloadModal } from './components/CodeDownloadModal';
import { AuthErrorModal } from './components/AuthErrorModal';
import { LandingHero } from './components/LandingHero';
import { Loader2, Plus, FolderArchive } from 'lucide-react';

interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export default function App() {
  const [user, setUser] = useState<User | MockUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthErrorModalOpen, setIsAuthErrorModalOpen] = useState(false);

  // Month state (YYYY-MM)
  const [currentMonthKey, setCurrentMonthKey] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<MonthlyBudget | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isCodeDownloadModalOpen, setIsCodeDownloadModalOpen] = useState(false);

  // Init connection & Auth listener
  useEffect(() => {
    testConnection();

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        syncUserProfile(currentUser);
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Sign in handler with graceful unauthorized-domain error handling
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      console.warn('Sign-in error intercepted:', err);
      // Open the helpful Authorized Domain modal
      setIsAuthErrorModalOpen(true);
    }
  };

  const handleLogOut = async () => {
    try {
      if (user && !user.uid.startsWith('demo_')) {
        await logOut();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
    }
  };

  const handleContinueDemo = async () => {
    setIsAuthErrorModalOpen(false);
    const demoUser: MockUser = {
      uid: 'demo_user',
      email: '69011219014@msu.ac.th',
      displayName: 'ผู้ใช้งานทดสอบ (Demo)',
      photoURL: null,
    };
    setUser(demoUser);
    await seedDemoTransactions('demo_user');
  };

  // Subscribe to Transactions when user is authenticated
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }

    const unsubscribeTx = subscribeTransactions(
      user.uid,
      (items) => {
        setTransactions(items);
      },
      (err) => {
        console.error('Error fetching transactions:', err);
      }
    );

    return () => unsubscribeTx();
  }, [user]);

  // Subscribe to Monthly Budget
  useEffect(() => {
    if (!user) {
      setBudget(null);
      return;
    }

    const unsubscribeBudget = subscribeMonthlyBudget(user.uid, currentMonthKey, (b) => {
      setBudget(b);
    });

    return () => unsubscribeBudget();
  }, [user, currentMonthKey]);

  // Handlers
  const handleSaveTransaction = async (data: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    if (editingTransaction) {
      await updateTransaction(user.uid, editingTransaction.id, data);
      setEditingTransaction(null);
    } else {
      await addTransaction(user.uid, data);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!user) return;
    await deleteTransaction(user.uid, id);
  };

  const handleSaveBudget = async (
    monthKey: string,
    limit: number,
    target: number,
    notes?: string
  ) => {
    if (!user) return;
    await saveMonthlyBudget(user.uid, monthKey, limit, target, notes);
  };

  const handleSeedDemo = async () => {
    if (!user) return;
    await seedDemoTransactions(user.uid);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Prompt',sans-serif]">
      {/* Navigation Bar */}
      <Navbar
        user={user}
        onOpenDownloadModal={() => setIsCodeDownloadModalOpen(true)}
        onSignIn={handleSignIn}
        onLogOut={handleLogOut}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {authLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-xs text-slate-400">กำลังเชื่อมต่อข้อมูลคลาวด์ Firebase...</span>
          </div>
        ) : !user ? (
          <LandingHero
            onSignIn={handleSignIn}
            onContinueDemo={handleContinueDemo}
            onOpenDownloadModal={() => setIsCodeDownloadModalOpen(true)}
          />
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Monthly Summary Cards & Action Bar */}
            <MonthlySummary
              currentMonthKey={currentMonthKey}
              onMonthChange={setCurrentMonthKey}
              transactions={transactions}
              budget={budget}
              onOpenAddModal={handleOpenAdd}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              onOpenExportModal={() => {
                const el = document.getElementById('visual-analytics-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onSeedDemo={handleSeedDemo}
            />

            {/* Visual Analytics & Infographic Image Generator */}
            <div id="visual-analytics-section">
              <VisualAnalytics
                currentMonthKey={currentMonthKey}
                transactions={transactions}
                budget={budget}
                userName={user.displayName || 'ผู้ใช้งาน'}
                userEmail={user.email || ''}
              />
            </div>

            {/* Transactions History & Filter List */}
            <TransactionList
              transactions={transactions}
              currentMonthKey={currentMonthKey}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteTransaction}
              onOpenAddModal={handleOpenAdd}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button for Mobile Add */}
      {user && (
        <div className="fixed bottom-6 right-6 sm:hidden z-30">
          <button
            onClick={handleOpenAdd}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/30 active:scale-95 transition"
            aria-label="บันทึกรายการใหม่"
          >
            <Plus className="w-7 h-7" />
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">My-new-Finance-tracker</span>
            <span>•</span>
            <span>ระบบจัดการรายรับรายจ่าย</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsCodeDownloadModalOpen(true)}
              className="hover:text-emerald-400 transition underline underline-offset-2 flex items-center gap-1"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>ดาวน์โหลด Code (.zip)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        editItem={editingTransaction}
        defaultDate={`${currentMonthKey}-${String(new Date().getDate()).padStart(2, '0')}`}
      />

      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        monthKey={currentMonthKey}
        currentBudget={budget}
        onSave={handleSaveBudget}
      />

      <CodeDownloadModal
        isOpen={isCodeDownloadModalOpen}
        onClose={() => setIsCodeDownloadModalOpen(false)}
      />

      <AuthErrorModal
        isOpen={isAuthErrorModalOpen}
        onClose={() => setIsAuthErrorModalOpen(false)}
        onContinueDemo={handleContinueDemo}
        projectId={firebaseConfig.projectId || 'newpro-11c43'}
      />
    </div>
  );
}
