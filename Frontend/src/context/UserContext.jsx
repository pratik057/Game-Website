/* eslint-disable react-refresh/only-export-components */
"use client";

import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const UserContext = createContext();

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = "https://game-website-yyuo.onrender.com/api/auth";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setBalance(response.data.balance || 0);
    } catch (err) {
      console.error("Error fetching user data:", err);
      localStorage.removeItem("token");
      setError("Session expired. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/login`, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);

      setBalance(response.data.user.balance || 0);
   
      // toast.success("Login successful!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  const register = async (username, email, password, mobileNo) => {
    try {
      await axios.post(`${API_BASE}/register`, {
        username,
        email,
        password,
        mobileNo,
      });
      // Auto-login after registration
      return await login(email, password);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      return false;
    }
  };

  

  const logout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      await axios.post(`${API_BASE}/logout`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Optionally show an error toast here
    }
  
    // Clear frontend state regardless of API response
    localStorage.removeItem("token");
    setUser(null);
    setBalance(0);
    // toast.info("Logged out successfully");
  };
  
  const updateBalance = (newBalance) => {
    setBalance(newBalance);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        balance,
        loading,
        error,
        login,
        register,
        logout,
        updateBalance,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
