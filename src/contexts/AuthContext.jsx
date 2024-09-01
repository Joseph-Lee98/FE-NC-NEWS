import React, { createContext, useState, useEffect } from "react";
import api from "../utils/useApi";
import { useNavigate } from "react-router-dom";
// import { loginUser, registerUser, deleteUserAccount } from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const api = useApi();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("jwt")
  );
  const navigate = useNavigate();

  const handleAuthError = (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "Invalid token"
    ) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      navigate("/login");
    }
    throw error; // Re-throw the error to handle it in the UI if necessary
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("jwt");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

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
      const loggedInUser = await api.post("/users/login", credentials, {
        headers: getAuthHeader(),
      });
      const { user, token } = loggedInUser.data;
      localStorage.setItem("jwt", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      handleAuthError(error);
    }
  };

  const register = async (userData) => {
    try {
      const registeredUser = await api.post("/users", userData, {
        headers: getAuthHeader(),
      });
      const { user, token } = registeredUser.data;
      localStorage.setItem("jwt", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      handleAuthError(error);
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
      await api.delete(`/users/${username}`, {
        headers: getAuthHeader(),
      });
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/register");
    } catch (error) {
      handleAuthError(error);
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
