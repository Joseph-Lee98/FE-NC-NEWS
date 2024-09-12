import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../contexts/AppContext";
import styles from "./Header.module.css";

const Header = () => {
  const { user, isAuthenticated, logout, deleteUser } = useContext(AppContext);

  const [showDropdown, setShowDropdown] = useState(false);

  const logoUrl = "/logo.jpeg";

  const defaultImgUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD6fmrTz-5wPJlO5UisF54wEFlfFdLim21Vw&s";

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
  };

  const handleAccountDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      setShowDropdown(false);
      deleteUser(user.username);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <Link to="/">
            <img src={logoUrl} alt="Logo" className={styles.logo} />
          </Link>
        </div>
        <div className={styles.centerSection}>
          {!isAuthenticated && (
            <p className={styles.welcomeMessage}>Welcome Guest!</p>
          )}
          {isAuthenticated && user?.role === "user" && (
            <p className={styles.welcomeMessage}>Welcome {user.name}!</p>
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
                  onClick={toggleDropdown}
                />
              )}
              {!user.avatar_url && (
                <img
                  src={defaultImgUrl}
                  alt="Default Avatar"
                  className={styles.avatar}
                  onClick={toggleDropdown}
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
                onClick={toggleDropdown}
              />
            </>
          )}
        </nav>
      </header>
      {showDropdown && isAuthenticated && (
        <div className={styles.dropdown}>
          <p className={styles.dropdownMessage}>Welcome {user?.name}!</p>
          <button onClick={handleLogout} className={styles.dropdownButton}>
            Logout
          </button>
          {user?.role === "user" && (
            <button
              onClick={handleAccountDelete}
              className={styles.dropdownButton}
            >
              Delete Account
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
