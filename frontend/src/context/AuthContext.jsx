import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('placementpilot_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('placementpilot_token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      api.getMe()
        .then(res => {
          if (res.profile) {
            setUser(res.profile);
            localStorage.setItem('placementpilot_user', JSON.stringify(res.profile));
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('placementpilot_token', res.token);
      localStorage.setItem('placementpilot_user', JSON.stringify(res.user));
      setLoading(false);
      return res.user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const res = await api.signup(userData);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('placementpilot_token', res.token);
      localStorage.setItem('placementpilot_user', JSON.stringify(res.user));
      setLoading(false);
      return res.user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('placementpilot_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('placementpilot_token');
    localStorage.removeItem('placementpilot_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
