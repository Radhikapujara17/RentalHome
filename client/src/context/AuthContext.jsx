import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rentnest_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('rentnest_token') || null);
  const [loading, setLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Quick switch demo login
  const demoLogin = async (role = 'tenant') => {
    try {
      setLoading(true);
      const res = await api.post('/auth/demo-login', { role });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('rentnest_token', res.data.token);
        localStorage.setItem('rentnest_user', JSON.stringify(res.data.user));
        toast.success(`Logged in as ${res.data.user.name} (${role.toUpperCase()})`);
        setIsAuthModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Phone OTP login
  const verifyOtp = async (phone, otp, role, name) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/verify-otp', { phone, otp, role, name });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('rentnest_token', res.data.token);
        localStorage.setItem('rentnest_user', JSON.stringify(res.data.user));
        toast.success(`Welcome to RentNest, ${res.data.user.name}!`);
        setIsAuthModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP code');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Standard Form Registration (Stored directly in MongoDB)
  const register = async (formData) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('rentnest_token', res.data.token);
        localStorage.setItem('rentnest_user', JSON.stringify(res.data.user));
        toast.success(`Welcome to RentNest, ${res.data.user.name}!`);
        setIsAuthModalOpen(false);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Standard Form Login
  const login = async (identifier, password) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { identifier, password });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('rentnest_token', res.data.token);
        localStorage.setItem('rentnest_user', JSON.stringify(res.data.user));
        toast.success(`Welcome back, ${res.data.user.name}!`);
        setIsAuthModalOpen(false);
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rentnest_token');
    localStorage.removeItem('rentnest_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        register,
        login,
        demoLogin,
        verifyOtp,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isChatOpen,
        setIsChatOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
