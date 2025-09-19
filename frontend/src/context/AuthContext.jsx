import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ email });
    }
  }, []);

  // --- LOGIN ---
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const token = res.data.access_token;
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser({ email });
    return res;
  };

  // --- REGISTER ---
  const register = async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    return res;
  };

  // --- LOGOUT ---
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // --- FORGOT PASSWORD ---
  const forgotPassword = async (email) => {
    return await api.post('/auth/forgot-password', { email });
  };

  // --- VERIFY OTP ---
  const verifyOtp = async (email, otp) => {
    return await api.post('/auth/verify-otp', { email, otp });
  };

  // --- RESET PASSWORD ---
  const resetPassword = async (email, otp, newPassword) => {
    return await api.post('/auth/reset-password', {
      email,
      otp,
      new_password: newPassword,
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, forgotPassword, verifyOtp, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
