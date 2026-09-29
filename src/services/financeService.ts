import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Transaction, MonthlyBudget, UserProfile } from '../types';

export function syncUserProfile(user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null }) {
  if (user.uid.startsWith('demo_')) return;

  const userRef = doc(db, 'users', user.uid);
  const data: Partial<UserProfile> = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || 'ผู้ใช้งาน',
    photoURL: user.photoURL || '',
    currency: 'THB',
    updatedAt: new Date().toISOString(),
  };

  setDoc(userRef, { ...data, createdAt: new Date().toISOString() }, { merge: true }).catch((err) => {
    try {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    } catch {
      // Catch Firestore error without crashing app
    }
  });
}

// Local storage helpers for demo mode
function getLocalTransactions(userId: string): Transaction[] {
  try {
    const raw = localStorage.getItem(`fin_tx_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalTransactions(userId: string, items: Transaction[]) {
  try {
    localStorage.setItem(`fin_tx_${userId}`, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function subscribeTransactions(
  userId: string,
  onData: (transactions: Transaction[]) => void,
  onError?: (err: unknown) => void
) {
  if (userId.startsWith('demo_')) {
    const local = getLocalTransactions(userId);
    onData(local);
    // Listen for storage events
    const listener = () => onData(getLocalTransactions(userId));
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }

  const collectionPath = `users/${userId}/transactions`;
  const q = query(collection(db, collectionPath), orderBy('date', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Transaction[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...(docSnap.data() as Omit<Transaction, 'id'>) });
      });
      onData(items);
    },
    (error) => {
      console.warn('Firestore subscription fallback:', error);
      if (onError) onError(error);
      // Fallback to local storage if Firestore has permission/unauthorized domain issue
      const local = getLocalTransactions(userId);
      if (local.length > 0) onData(local);
    }
  );
}

export async function addTransaction(userId: string, data: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) {
  const newId = 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const payload: Transaction = {
    ...data,
    id: newId,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (userId.startsWith('demo_')) {
    const local = getLocalTransactions(userId);
    local.unshift(payload);
    saveLocalTransactions(userId, local);
    return payload;
  }

  const collectionPath = `users/${userId}/transactions`;
  const docRef = doc(db, collectionPath, newId);

  try {
    await setDoc(docRef, payload);
    return payload;
  } catch (error) {
    // If Firestore write fails, save to local as fallback so user work is never lost
    console.warn('Saving locally due to Firestore issue:', error);
    const local = getLocalTransactions(userId);
    local.unshift(payload);
    saveLocalTransactions(userId, local);
    return payload;
  }
}

export async function updateTransaction(userId: string, id: string, data: Partial<Transaction>) {
  if (userId.startsWith('demo_')) {
    const local = getLocalTransactions(userId);
    const index = local.findIndex((t) => t.id === id);
    if (index !== -1) {
      local[index] = { ...local[index], ...data, updatedAt: new Date().toISOString() };
      saveLocalTransactions(userId, local);
    }
    return;
  }

  const path = `users/${userId}/transactions/${id}`;
  const docRef = doc(db, path);
  try {
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('Local update fallback:', error);
    const local = getLocalTransactions(userId);
    const index = local.findIndex((t) => t.id === id);
    if (index !== -1) {
      local[index] = { ...local[index], ...data, updatedAt: new Date().toISOString() };
      saveLocalTransactions(userId, local);
    }
  }
}

export async function deleteTransaction(userId: string, id: string) {
  if (userId.startsWith('demo_')) {
    let local = getLocalTransactions(userId);
    local = local.filter((t) => t.id !== id);
    saveLocalTransactions(userId, local);
    return;
  }

  const path = `users/${userId}/transactions/${id}`;
  const docRef = doc(db, path);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Local delete fallback:', error);
    let local = getLocalTransactions(userId);
    local = local.filter((t) => t.id !== id);
    saveLocalTransactions(userId, local);
  }
}

export function subscribeMonthlyBudget(
  userId: string,
  monthKey: string,
  onData: (budget: MonthlyBudget | null) => void
) {
  if (userId.startsWith('demo_')) {
    try {
      const raw = localStorage.getItem(`fin_budget_${userId}_${monthKey}`);
      onData(raw ? JSON.parse(raw) : null);
    } catch {
      onData(null);
    }
    return () => {};
  }

  const path = `users/${userId}/monthlyBudgets/${monthKey}`;
  const docRef = doc(db, path);

  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData({ id: snapshot.id, ...(snapshot.data() as Omit<MonthlyBudget, 'id'>) });
      } else {
        onData(null);
      }
    },
    (error) => {
      console.warn('Budget subscribe fallback:', error);
      try {
        const raw = localStorage.getItem(`fin_budget_${userId}_${monthKey}`);
        onData(raw ? JSON.parse(raw) : null);
      } catch {
        onData(null);
      }
    }
  );
}

export async function saveMonthlyBudget(
  userId: string,
  monthKey: string,
  budgetLimit: number,
  savingsTarget: number,
  notes?: string
) {
  const payload: MonthlyBudget = {
    id: monthKey,
    userId,
    monthKey,
    budgetLimit,
    savingsTarget,
    notes: notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (userId.startsWith('demo_')) {
    localStorage.setItem(`fin_budget_${userId}_${monthKey}`, JSON.stringify(payload));
    return payload;
  }

  const path = `users/${userId}/monthlyBudgets/${monthKey}`;
  const docRef = doc(db, path);

  try {
    await setDoc(docRef, payload, { merge: true });
    return payload;
  } catch (error) {
    console.warn('Budget save fallback:', error);
    localStorage.setItem(`fin_budget_${userId}_${monthKey}`, JSON.stringify(payload));
    return payload;
  }
}

export async function seedDemoTransactions(userId: string) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const demoItems: Omit<Transaction, 'id' | 'userId' | 'createdAt'>[] = [
    {
      type: 'income',
      amount: 45000,
      category: 'เงินเดือน / ค่าจ้าง',
      date: `${year}-${month}-01`,
      paymentMethod: 'โอนเงิน/พร้อมเพย์',
      note: 'เงินเดือนประจำเดือน',
    },
    {
      type: 'income',
      amount: 8500,
      category: 'ฟรีแลนซ์ / งานเสริม',
      date: `${year}-${month}-05`,
      paymentMethod: 'โอนเงิน/พร้อมเพย์',
      note: 'รับงานออกแบบเว็บไซต์',
    },
    {
      type: 'expense',
      amount: 8500,
      category: 'ค่าที่พัก / ค่าเช่า',
      date: `${year}-${month}-02`,
      paymentMethod: 'โอนเงิน/พร้อมเพย์',
      note: 'ค่าเช่าห้องพักรายเดือน',
    },
    {
      type: 'expense',
      amount: 1850,
      category: 'ค่าน้ำ ค่าไฟ อินเทอร์เน็ต',
      date: `${year}-${month}-04`,
      paymentMethod: 'โอนเงิน/พร้อมเพย์',
      note: 'ค่าน้ำ-ไฟ และอินเทอร์เน็ตบ้าน',
    },
    {
      type: 'expense',
      amount: 1200,
      category: 'การเดินทาง / ค่าน้ำมัน',
      date: `${year}-${month}-06`,
      paymentMethod: 'บัตรเครดิต',
      note: 'เติมน้ำมันรถยนต์',
    },
    {
      type: 'expense',
      amount: 450,
      category: 'อาหารและเครื่องดื่ม',
      date: `${year}-${month}-07`,
      paymentMethod: 'โอนเงิน/พร้อมเพย์',
      note: 'ทานอาหารมื้อเย็นกับเพื่อน',
    },
    {
      type: 'expense',
      amount: 1990,
      category: 'ช้อปปิ้ง / ของใช้',
      date: `${year}-${month}-09`,
      paymentMethod: 'บัตรเครดิต',
      note: 'ซื้อของใช้ในบ้านและซูเปอร์มาร์เก็ต',
    },
    {
      type: 'expense',
      amount: 600,
      category: 'การศึกษา / หนังสือ',
      date: `${year}-${month}-12`,
      paymentMethod: 'เงินสด',
      note: 'ซื้อหนังสือการเงินและการลงทุน',
    },
    {
      type: 'expense',
      amount: 2500,
      category: 'ครอบครัว / ให้พ่อแม่',
      date: `${year}-${month}-15`,
      paymentMethod: 'โอนเงิน/พร้อมเพย์',
      note: 'โอนเงินให้คุณแม่',
    },
    {
      type: 'expense',
      amount: 320,
      category: 'อาหารและเครื่องดื่ม',
      date: `${year}-${month}-18`,
      paymentMethod: 'กระเป๋าเงินดิจิทัล',
      note: 'กาแฟและอาหารกลางวัน',
    },
    {
      type: 'income',
      amount: 3200,
      category: 'เงินปันผล / กำไรลงทุน',
      date: `${year}-${month}-20`,
      paymentMethod: 'โอนเงิน/พร้อมเพย์',
      note: 'เงินปันผลกองทุนรวม',
    },
    {
      type: 'expense',
      amount: 890,
      category: 'บันเทิง / ท่องเที่ยว',
      date: `${year}-${month}-22`,
      paymentMethod: 'บัตรเครดิต',
      note: 'ดูหนังและสตรีมมิ่ง',
    },
  ];

  for (const item of demoItems) {
    await addTransaction(userId, item);
  }

  // Set default budget
  await saveMonthlyBudget(userId, `${year}-${month}`, 25000, 15000, 'งบประมาณเริ่มต้นสำหรับการออม');
}
