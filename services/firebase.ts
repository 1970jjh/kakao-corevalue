import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore';

// Firebase 설정 - 환경변수에서 가져오거나 직접 설정
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 타입 정의
export interface GuestbookEntry {
  id?: string;
  userName: string;
  rating: number;
  message: string;
  totalPoints: number;
  completionTime: string;
  createdAt: Timestamp | Date;
}

export interface LeaderboardEntry {
  id?: string;
  userName: string;
  totalPoints: number;
  completionTime: string;
  completedAt: Timestamp | Date;
}

// 방명록 추가
export const addGuestbookEntry = async (entry: Omit<GuestbookEntry, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'guestbook'), {
      ...entry,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding guestbook entry:', error);
    throw error;
  }
};

// 방명록 실시간 구독
export const subscribeToGuestbook = (callback: (entries: GuestbookEntry[]) => void) => {
  const q = query(
    collection(db, 'guestbook'),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const entries: GuestbookEntry[] = [];
    snapshot.forEach((doc) => {
      entries.push({ id: doc.id, ...doc.data() } as GuestbookEntry);
    });
    callback(entries);
  });
};

// 리더보드에 점수 추가
export const addLeaderboardEntry = async (entry: Omit<LeaderboardEntry, 'id' | 'completedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'leaderboard'), {
      ...entry,
      completedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding leaderboard entry:', error);
    throw error;
  }
};

// 리더보드 상위 30위 가져오기
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('totalPoints', 'desc'),
      limit(30)
    );
    const snapshot = await getDocs(q);
    const entries: LeaderboardEntry[] = [];
    snapshot.forEach((doc) => {
      entries.push({ id: doc.id, ...doc.data() } as LeaderboardEntry);
    });
    return entries;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
};

// 리더보드 실시간 구독
export const subscribeToLeaderboard = (callback: (entries: LeaderboardEntry[]) => void) => {
  const q = query(
    collection(db, 'leaderboard'),
    orderBy('totalPoints', 'desc'),
    limit(30)
  );

  return onSnapshot(q, (snapshot) => {
    const entries: LeaderboardEntry[] = [];
    snapshot.forEach((doc) => {
      entries.push({ id: doc.id, ...doc.data() } as LeaderboardEntry);
    });
    callback(entries);
  });
};

export { db };
