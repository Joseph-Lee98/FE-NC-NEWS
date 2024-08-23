import React, { createContext, useState, useEffect } from "react";
import {
  fetchArticles,
  fetchTopics,
  postArticle,
  updateArticleById,
  deleteArticleById,
  postCommentByArticleId,
} from "../utils/api";

export const ArticlesContext = createContext();

export const ArticlesProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [topics, setTopics] = useState([]);

  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState(null);

  const [topicsLoading, setTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState(null);

  const [filters, setFilters] = useState({});

  useEffect(() => {
    const loadTopics = async () => {
      setTopicsLoading(true);
      setTopicsError(null);
      try {
        const topicsData = await fetchTopics();
        setTopics(topicsData);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
        setTopicsError("Failed to fetch topics.");
      } finally {
        setTopicsLoading(false);
      }
    };

    loadTopics();
  }, []);

  useEffect(() => {
    const loadArticles = async () => {
      setArticlesLoading(true);
      setArticlesError(null);
      try {
        const articlesData = await fetchArticles(filters);
        setArticles(articlesData);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setArticlesError("Failed to fetch articles.");
      } finally {
        setArticlesLoading(false);
      }
    };

    loadArticles();
  }, [filters]);

  const refreshArticles = async () => {
    setArticlesLoading(true);
    setArticlesError(null);
    try {
      const articlesData = await fetchArticles(filters);
      setArticles(articlesData);
    } catch (error) {
      console.error("Failed to refresh articles:", error);
      setArticlesError("Failed to refresh articles.");
    } finally {
      setArticlesLoading(false);
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
      const newArticle = await postArticle(articleData);
      setArticles((prevArticles) => [newArticle, ...prevArticles]);
    } catch (error) {
      console.error("Failed to add article:", error);
      setArticlesError("Failed to add article.");
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
      setArticlesError("Failed to update article.");
      throw error;
    }
  };

  const removeArticle = async (articleId) => {
    try {
      await deleteArticleById(articleId);
      setArticles((prevArticles) =>
        prevArticles.filter((article) => article.article_id !== articleId)
      );
    } catch (error) {
      console.error("Failed to delete article:", error);
      setArticlesError("Failed to delete article.");
      throw error;
    }
  };

  const addComment = async (articleId, commentData) => {
    try {
      await postCommentByArticleId(articleId, commentData);

      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.article_id === articleId
            ? { ...article, comment_count: article.comment_count + 1 }
            : article
        )
      );
    } catch (error) {
      console.error("Failed to add comment:", error);
      setArticlesError("Failed to add comment.");
      throw error;
    }
  };

  return (
    <ArticlesContext.Provider
      value={{
        articles,
        topics,
        filters,
        articlesLoading,
        articlesError,
        topicsLoading,
        topicsError,
        updateFilters,
        addArticle,
        updateArticle,
        removeArticle,
        refreshArticles,
        addComment,
      }}
    >
      {children}
    </ArticlesContext.Provider>
  );
};
