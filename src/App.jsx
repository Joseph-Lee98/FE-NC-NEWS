import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ArticlesProvider } from "./contexts/ArticlesContext";
import Header from "./components/header/Header.jsx";
import HomePage from "./components/homePage/Homepage.jsx";
import ArticlePage from "./components/articlePage/ArticlePage.jsx";
import LoginPage from "./components/login/Login.jsx";
import RegisterPage from "./components/register/Register.jsx";
import UserPage from "./components/userpage/Userpage.jsx";
import AdminPage from "./components/admin/Admin.jsx";
import "./app.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ArticlesProvider>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:article_id" element={<ArticlePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/user/:username" element={<UserPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </ArticlesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
