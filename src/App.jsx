import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ArticlesProvider } from "./contexts/ArticlesContext";
import Header from "./components/header";
import HomePage from "./components/homePage";
import ArticlePage from "./components/articlepage";
import Login from "./components/login";
import Register from "./components/register";
import UserPage from "./components/userpage";
import AdminPage from "./components/adminpage";
import "./app.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ArticlesProvider>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user/:username" element={<UserPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </ArticlesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
