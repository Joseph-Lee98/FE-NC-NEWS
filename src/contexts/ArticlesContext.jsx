import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchArticles,
  fetchArticleById,
  fetchTopics,
  postArticle,
  updateArticleById,
  deleteArticleById,
} from "../utils/api";
import { AuthContext } from "./AuthContext";

export const ArticlesContext = createContext();

export const ArticlesProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState({});
  const [articleId, setArticleId] = useState(null);
  const [topics, setTopics] = useState([]);

  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [errorFetchingArticles, setErrorFetchingArticles] = useState("");
  const [errorFetchingArticle, setErrorFetchingArticle] = useState("");
  const [errorFetchingTopics, setErrorFetchingTopics] = useState("");

  const {
    isAuthenticated,
    setIsAuthenticated,
    filters,
    setFilters,
    setTokenInvalidated,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleAuthError = (error) => {
    console.log("inside handleAuthError in ArticlesContext");
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "Invalid token"
    ) {
      console.log("inside handleAuthError functionality in AuthContext");
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      setFilters({ sort_by: "created_at", order_by: "desc", topic: "" });
      setTokenInvalidated(true);
    }
    throw error; // Re-throw the error to handle it in the UI if necessary
  };

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
    loadArticle();
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

  const updateArticle = async (articleId, incVotes) => {
    try {
      await updateArticleById(articleId, incVotes);
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

  return (
    <ArticlesContext.Provider
      value={{
        articles,
        setArticles,
        topics,
        filters,
        isLoadingArticles,
        isLoadingArticle,
        isLoadingTopics,
        updateFilters,
        addArticle,
        updateArticle,
        removeArticle,
        errorFetchingArticles,
        errorFetchingArticle,
        errorFetchingTopics,
        setArticleId,
        article,
        setArticle,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};
