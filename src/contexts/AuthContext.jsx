import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, deleteUserAccount } from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("jwt")
  );
  const navigate = useNavigate();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (jwt && storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const jwt = localStorage.getItem("jwt");
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (jwt && storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        navigate("/login"); // Redirect to login if the JWT is removed or invalid
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

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
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  const deleteUser = async (username) => {
    console.log("got into the deleteUser function in AuthContext");
    try {
      await deleteUserAccount(username);
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/register");
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
