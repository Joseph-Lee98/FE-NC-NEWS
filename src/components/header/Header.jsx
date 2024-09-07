import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";
import styles from "./Header.module.css";

const Header = () => {
  const { user, isAuthenticated, logout, deleteUser } = useContext(AppContext);
  const navigate = useNavigate();

  const logoUrl = "/logo.jpeg";

  const defaultImgUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD6fmrTz-5wPJlO5UisF54wEFlfFdLim21Vw&s";

  const handleLogout = () => {
    logout();
  };

  const handleAccountDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      deleteUser(user.username);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link to="/">
          <img src={logoUrl} alt="Logo" className={styles.logo} />
        </Link>
      </div>
      <div className={styles.centerSection}>
        {!isAuthenticated && (
          <p className={styles.welcomeMessage}>Hello, Guest!</p>
        )}
        {isAuthenticated && user?.role === "user" && (
          <p className={styles.welcomeMessage}>Welcome, {user.username}!</p>
        )}
        {isAuthenticated && user?.role === "admin" && (
          <p className={styles.welcomeMessage}>Welcome Admin!</p>
        )}
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
            {user.avatar_url && (
              <img
                src={user.avatar_url}
                alt="User Avatar"
                className={styles.avatar}
              />
            )}
            {!user.avatar_url && (
              <img
                src={defaultImgUrl}
                alt="Default Avatar"
                className={styles.avatar}
              />
            )}
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
            <img
              src={user.avatar_url}
              alt="Admin Avatar"
              className={styles.avatar}
            />
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
