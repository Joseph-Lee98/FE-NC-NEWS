import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./Header.module.css";
import logo from "/logo.jpeg";

const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAccountDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      deleteUser(user.username);
      navigate("/register");
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link to="/">
          <img src={logo} alt="Logo" className={styles.logo} />
        </Link>
      </div>
      <nav className={styles.navLinks}>
        {!isAuthenticated && (
          <>
            <Link to="/login" className={styles.link}>
              Login
            </Link>
            <Link to="/register" className={styles.link}>
              Register
            </Link>
          </>
        )}
        {isAuthenticated && user?.role === "user" && (
          <>
            <Link to={`/user/${user.username}`} className={styles.link}>
              Userpage
            </Link>
            <button onClick={handleLogout} className={styles.button}>
              Logout
            </button>
            <button onClick={handleAccountDelete} className={styles.button}>
              Delete Account
            </button>
          </>
        )}
        {isAuthenticated && user?.role === "admin" && (
          <>
            <Link to="/admin" className={styles.link}>
              Admin Dashboard
            </Link>
            <button onClick={handleLogout} className={styles.button}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
