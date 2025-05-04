import React, { createContext, useContext, useState, useEffect } from 'react';
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
  sendPasswordResetEmail
} from 'firebase/auth';

// Tạo context cho authentication
export const AuthContext = createContext(null);

// Hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Đăng nhập với email và mật khẩu
  const signIn = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Đăng ký tài khoản mới
  const signUp = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Cập nhật thông tin người dùng
    await updateProfile(userCredential.user, {
      displayName: displayName
    });
    return userCredential;
  };

  // Đăng xuất
  const signOut = async () => {
    return firebaseSignOut(auth);
  };

  // Yêu cầu đặt lại mật khẩu
  const resetPassword = async (email) => {
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
  const value = {
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