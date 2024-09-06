import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchArticles,
  fetchArticleById,
  fetchTopics,
  fetchCommentsById,
  postArticle,
  postComment,
  updateArticleById,
  updateCommentById,
  deleteArticleById,
  deleteCommentById,
  loginUser,
  registerUser,
  deleteUserAccount,
} from "../utils/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    sort_by: "created_at",
    order_by: "desc",
    topic: "",
  });
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("jwt")
  );
  const [tokenInvalidated, setTokenInvalidated] = useState(false);
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState({});
  const [articleId, setArticleId] = useState(null);
  const [topics, setTopics] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [errorFetchingArticles, setErrorFetchingArticles] = useState("");
  const [errorFetchingArticle, setErrorFetchingArticle] = useState("");
  const [errorFetchingTopics, setErrorFetchingTopics] = useState("");
  const [errorFetchingComments, setErrorFetchingComments] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (tokenInvalidated) {
      navigate("/login");
      setTokenInvalidated(false);
    }
  }, [tokenInvalidated, navigate]);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (jwt && storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
      setTokenInvalidated(false);
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
        setTokenInvalidated(false);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        // navigate("/login");
        // Redirect to login if the JWT is removed or invalid
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  useEffect(() => {
    if (!articleId) return;
    const loadArticle = async () => {
      try {
        setErrorFetchingArticle("");
        setIsLoadingArticle(true);
        const response = await fetchArticleById(articleId);
        setArticle(response.data);
      } catch (error) {
        setErrorFetchingArticle(
          "Failed to load article, please try refreshing the page"
        );
      } finally {
        setIsLoadingArticle(false);
      }
    };

    const loadComments = async () => {
      try {
        setErrorFetchingComments("");
        setIsLoadingComments(true);
        const response = await fetchCommentsById(articleId);
        setComments(response.data);
      } catch (error) {
        setErrorFetchingComments(
          "Failed to load comments, please try refreshing the page"
        );
      } finally {
        setIsLoadingComments(false);
      }
    };

    loadArticle();
    loadComments();
  }, [articleId]);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        setErrorFetchingTopics("");
        setIsLoadingTopics(true);
        const topicsData = await fetchTopics();
        setTopics(topicsData.data);
      } catch (error) {
        setErrorFetchingTopics(
          "Failed to load topics, please try refreshing the page"
        );
      } finally {
        setIsLoadingTopics(false);
      }
    };

    loadTopics();
  }, []);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setErrorFetchingArticles("");
        setIsLoadingArticles(true);
        const response = await fetchArticles(filters);
        setArticles(response.data);
      } catch (error) {
        setErrorFetchingArticles(
          "Failed to load articles, please try refreshing the page"
        );
      } finally {
        setIsLoadingArticles(false);
      }
    };

    loadArticles();
  }, [filters]);

  useEffect(() => {
    setFilters({
      sort_by: "created_at",
      order_by: "desc",
      topic: "",
    });
  }, [isAuthenticated]);

  const handleAuthError = (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "Invalid token"
    ) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      setFilters({ sort_by: "created_at", order_by: "desc", topic: "" });
      setTokenInvalidated(true);
    }
    throw error;
  };

  const login = async (credentials) => {
    try {
      const loggedInUser = await loginUser(credentials);
      const { user, token } = loggedInUser.data;
      localStorage.setItem("jwt", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      setTokenInvalidated(false);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const register = async (userData) => {
    try {
      const registeredUser = await registerUser(userData);
      const { user, token } = registeredUser.data;
      localStorage.setItem("jwt", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      setTokenInvalidated(false);
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
    try {
      await deleteUserAccount(username);
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/register");
    } catch (error) {
      handleAuthError(error);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const addArticle = async (articleData) => {
    try {
      const response = await postArticle(articleData);
      return response.data;
    } catch (error) {
      handleAuthError(error);
    }
  };

  const addComment = async (articleId, commentData) => {
    try {
      const response = await postComment(articleId, commentData);
      return response.data;
    } catch (error) {
      handleAuthError(error);
    }
  };

  const updateArticle = async (articleId, incVotes) => {
    try {
      await updateArticleById(articleId, incVotes);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const updateComment = async (commentId, incVotes) => {
    try {
      await updateCommentById(commentId, incVotes);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const removeArticle = async (articleId) => {
    try {
      await deleteArticleById(articleId);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const removeComment = async (commentId) => {
    try {
      await deleteCommentById(commentId);
    } catch (error) {
      handleAuthError(error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        filters,
        setFilters,
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        articles,
        setArticles,
        article,
        setArticle,
        articleId,
        setArticleId,
        topics,
        setTopics,
        comments,
        setComments,
        isLoadingArticles,
        setIsLoadingArticles,
        isLoadingArticle,
        setIsLoadingArticle,
        isLoadingTopics,
        setIsLoadingTopics,
        isLoadingComments,
        setIsLoadingComments,
        errorFetchingArticle,
        setErrorFetchingArticle,
        errorFetchingArticles,
        setErrorFetchingArticles,
        errorFetchingTopics,
        setErrorFetchingTopics,
        errorFetchingComments,
        setErrorFetchingComments,
        login,
        register,
        logout,
        deleteUser,
        updateFilters,
        addArticle,
        addComment,
        updateArticle,
        updateComment,
        removeArticle,
        removeComment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
