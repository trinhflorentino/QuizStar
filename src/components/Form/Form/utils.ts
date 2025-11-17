import { v4 as uuid } from "uuid";
import { getAuth } from "firebase/auth";
import { Timestamp } from "firebase/firestore/lite";

// Utility for guest users
export const getGuestId = (): string => {
  let guestId = localStorage.getItem('quizstar_guest_id');
  if (!guestId) {
    guestId = `guest_${uuid()}`;
    localStorage.setItem('quizstar_guest_id', guestId);
  }
  return guestId;
};

// Get user email or guest ID
export const getUserIdentifier = (): string => {
  const auth = getAuth();
  if (auth.currentUser && auth.currentUser.email) {
    return auth.currentUser.email;
  }
  return getGuestId();
};

// Get user ID (UID) or guest ID for path identification in Realtime Database
export const getUserIdForPath = (): string => {
  const auth = getAuth();
  if (auth.currentUser && auth.currentUser.uid) {
    return auth.currentUser.uid;
  }
  return getGuestId();
};

// Check if user is authenticated
export const isUserAuthenticated = (): boolean => {
  const auth = getAuth();
  return !!auth.currentUser;
};

// Utility functions
export const firestoreTimestampToDate = (timestamp: any): Date | null => {
  if (!timestamp) return null;
  if (timestamp.toDate) return timestamp.toDate();
  if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
  return new Date(timestamp);
};

export const calculateRemainingTime = (startTimestamp: any, durationMinutes: number | null): number | null => {
  if (!startTimestamp || !durationMinutes) return null;
  const startTime = firestoreTimestampToDate(startTimestamp);
  if (!startTime) return null;
  const now = new Date();
  const elapsedMs = now.getTime() - startTime.getTime();
  const elapsedMinutes = Math.floor(elapsedMs / 60000);
  const remainingMinutes = durationMinutes - elapsedMinutes;
  return remainingMinutes > 0 ? remainingMinutes : 0;
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  const shuffled = [...array];
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }
  return shuffled;
};

export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      if (timeout) clearTimeout(timeout);
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};


