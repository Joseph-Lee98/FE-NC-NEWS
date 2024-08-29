import React, { createContext, useState, useEffect, useContext } from "react";
import {
  fetchArticles,
  fetchArticleById,
  fetchTopics,
  postArticle,
  updateArticleById,
  deleteArticleById,
  postCommentByArticleId,
  fetchCommentsByArticleId,
  deleteCommentById,
} from "../utils/api";
import { AuthContext } from "./AuthContext";

export const ArticlesContext = createContext();

export const ArticlesProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState({});
  const [articleId, setArticleId] = useState(null);
  const [topics, setTopics] = useState([]);
  const [filters, setFilters] = useState({
    sort_by: "created_at",
    order_by: "desc",
    topic: "",
  });
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [errorFetchingArticles, setErrorFetchingArticles] = useState("");
  const [errorFetchingArticle, setErrorFetchingArticle] = useState("");
  const [errorFetchingTopics, setErrorFetchingTopics] = useState("");

  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!articleId) return;
    const loadArticle = async () => {
      try {
        setErrorFetchingArticle("");
        setIsLoadingArticle(true);
        const fetchedArticle = await fetchArticleById(articleId);
        setArticle(fetchedArticle);
      } catch (error) {
        console.error("Error loading article:", error);
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
        setTopics(topicsData);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
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
        const articlesData = await fetchArticles(filters);
        setArticles(articlesData);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
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

  const refreshArticles = async () => {
    try {
      setIsLoading(true);
      const articlesData = await fetchArticles(filters);
      setArticles(articlesData);
    } catch (error) {
      console.error("Failed to refresh articles:", error);
      throw error;
    } finally {
      setIsLoading(false);
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
      return response; // This should return the full article data with the correct article_id from the backend
    } catch (error) {
      console.error("Failed to add article:", error);
      throw error;
    }
  };

  const updateArticle = async (articleId, incVotes) => {
    try {
      const updatedArticle = await updateArticleById(articleId, incVotes);
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.article_id === articleId ? updatedArticle : article
        )
      );
    } catch (error) {
      console.error("Failed to update article:", error);
      throw error;
    }
  };

  const updateArticleCommentCount = (articleId, incCount) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.article_id === articleId
          ? { ...article, comment_count: article.comment_count + incCount }
          : article
      )
    );
  };

  const removeArticle = async (articleId) => {
    try {
      await deleteArticleById(articleId);
      setArticles((prevArticles) =>
        prevArticles.filter((article) => article.article_id !== articleId)
      );
    } catch (error) {
      console.error("Failed to delete article:", error);
      throw error;
    }
  };

  const addComment = async (articleId, commentData) => {
    try {
      const newComment = await postCommentByArticleId(articleId, commentData);

      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.article_id === articleId
            ? { ...article, comment_count: article.comment_count + 1 }
            : article
        )
      );
      return newComment;
    } catch (error) {
      console.error("Failed to add comment:", error);
      throw error;
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await deleteCommentById(commentId);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      throw error; // Rethrow the error to handle it in the CommentCard
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
        updateArticleCommentCount,
        removeArticle,
        refreshArticles,
        addComment,
        deleteComment,
        errorFetchingArticles,
        errorFetchingArticle,
        errorFetchingTopics,
        setArticleId,
        article,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};
