import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { 
  auth
} from '../services/firebaseConfig';
import db from '../services/firebaseConfig';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile,
  sendPasswordResetEmail,
  UserCredential
} from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  user: User | null;
  loading: boolean;
  authInitialized: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, displayName: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Tạo context cho authentication
export const AuthContext = createContext<AuthContextType | null>(null);

// Hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  // Đăng nhập với email và mật khẩu
  const signIn = async (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Đăng ký tài khoản mới
  const signUp = async (email: string, password: string, displayName: string): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Cập nhật thông tin người dùng
    await updateProfile(userCredential.user, {
      displayName: displayName
    });
    return userCredential;
  };

  // Đăng xuất
  const signOut = async (): Promise<void> => {
    return firebaseSignOut(auth);
  };

  // Yêu cầu đặt lại mật khẩu
  const resetPassword = async (email: string): Promise<void> => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    // Đăng ký listener cho trạng thái xác thực
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthInitialized(true);
      setLoading(false);
    });

    // Hủy đăng ký listener khi component unmount
    return unsubscribe;
  }, []);

  // Giá trị được cung cấp cho context
  const value: AuthContextType = {
    currentUser,
    user: currentUser, // Alias cho currentUser để dễ sử dụng
    loading,
    authInitialized,
    signIn,
    signUp,
    signOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};




