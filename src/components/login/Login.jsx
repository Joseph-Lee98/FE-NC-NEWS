import React, { useState, useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const LoginPage = () => {
  const { login, user, isAuthenticated, tokenInvalidated, authErrorMessage } =
    useContext(AppContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [demoLoginError, setDemoLoginError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password });
      navigate("/");
    } catch (err) {
      setLoginError(
        "Login failed. Please check your credentials and try again."
      );
    }
  };

  const handleDemoLogin = async ({ username, password }) => {
    try {
      await login({ username, password });
      navigate("/");
    } catch (err) {
      setDemoLoginError(
        "Login failed. Please try again, or perhaps select a different demo account."
      );
    }
  };

  const demoAccounts = [
    {
      username: "tickle122",
      name: "Tom Tickle",
      avatar_url:
        "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
      password: "Tickle@2024#",
    },
    {
      username: "grumpy19",
      name: "Paul Grump",
      avatar_url:
        "https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013",
      password: "Grumpy19@#2024",
    },
    {
      username: "happyamy2016",
      name: "Amy Happy",
      avatar_url:
        "https://vignette1.wikia.nocookie.net/mrmen/images/7/7f/Mr_Happy.jpg/revision/latest?cb=20140102171729",
      password: "H@ppyAmy2024!",
    },
    {
      username: "cooljmessy",
      name: "Peter Messy",
      avatar_url:
        "https://vignette.wikia.nocookie.net/mrmen/images/1/1a/MR_MESSY_4A.jpg/revision/latest/scale-to-width-down/250?cb=20170730171002",
      password: "C00l_Jm3ssy#23",
    },
    {
      username: "weegembump",
      name: "Gemma Bump",
      avatar_url:
        "https://vignette.wikia.nocookie.net/mrmen/images/7/7e/MrMen-Bump.png/revision/latest?cb=20180123225553",
      password: "W33gemBump@2024",
    },
    {
      username: "jessjelly",
      name: "Jess Jelly",
      avatar_url:
        "https://vignette.wikia.nocookie.net/mrmen/images/4/4f/MR_JELLY_4A.jpg/revision/latest?cb=20180104121141",
      password: "J3ss_J3lly#21",
    },
  ];

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Login</h2>
        {authErrorMessage && <p className={styles.error}>{authErrorMessage}</p>}
        {loginError && <p className={styles.error}>{loginError}</p>}
        <form onSubmit={handleLogin} className={styles.form}>
          <label htmlFor="username" className={styles.label}>
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            required
          />

          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />

          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
      </div>
      <div className={styles.demoContainer}>
        <h3 className={styles.demoTitle}>Demo Accounts</h3>
        {demoAccounts.map((demoUser) => (
          <div
            key={demoUser.username}
            className={styles.demoBox}
            onClick={handleDemoLogin(demoUser)}
          >
            <h4 className={styles.demoUsername}>{demoUser.username}</h4>
            <img
              src={demoUser.avatar_url}
              alt={`The user avatar for the demo account with the username of ${demoUser.username}`}
              className={styles.demoAvatar}
            />
            <p className={styles.demoName}>{demoUser.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginPage;
