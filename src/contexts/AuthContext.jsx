import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
  fetchUserDetails,
  deleteUserAccount,
} from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("jwt")
  );
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      if (isAuthenticated) {
        try {
          const userData = await fetchUserDetails();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          logout();
        }
      }
    };

    initializeUser();
  }, [isAuthenticated]);

  const login = async (credentials) => {
    try {
      const loggedInUser = await loginUser(credentials);
      setUser(loggedInUser);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const registeredUser = await registerUser(userData);
      setUser(registeredUser);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const deleteUser = async (username) => {
    try {
      await deleteUserAccount(username);
      logout();
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout, deleteUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
