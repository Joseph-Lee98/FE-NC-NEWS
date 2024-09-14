import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.css";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.errorPageContainer}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>
          Oops! The page you're looking for doesn't exist.
        </p>
        <button className={styles.button} onClick={handleGoHome}>
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
