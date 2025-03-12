/* eslint-disable react-refresh/only-export-components */
"use client";

import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setBalance(response.data.balance);
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
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      setBalance(response.data.user.balance);
      toast.success("Login successful!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { username, email, password }
      );
      await login(email, password); 
      toast.success("Registration successful! Please login.");
      return true; // ✅ Removed the incorrect `na` and properly returned true
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setBalance(0);
    toast.info("Logged out successfully");
  };

  const sendOtp = async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        { email }
      );
      return response.data.message;
    } catch (error) {
      return error.response?.data?.message || "Error sending OTP";
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { email, otp }
      );
      return response.data.message;
    } catch (error) {
      return error.response?.data?.message || "Error verifying OTP";
    }
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
        sendOtp,
        verifyOtp,
        updateBalance,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
