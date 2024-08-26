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
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const topicsData = await fetchTopics();
        setTopics(topicsData);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
        throw error;
      }
    };

    loadTopics();
  }, []);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        const articlesData = await fetchArticles(filters);
        setArticles(articlesData);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, [filters]);

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
      if (articleData.article_img_url === "") {
        delete articleData.article_img_url;
      }
      const newArticle = await postArticle(articleData);

      const meetsFilterConditions = (article) => {
        return !filters.topic || article.topic === filters.topic;
      };

      if (meetsFilterConditions(newArticle)) {
        setArticles((prevArticles) => [newArticle, ...prevArticles]);
      }
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
      throw error;
    }
  };

  return (
    <ArticlesContext.Provider
      value={{
        articles,
        topics,
        filters,
        isLoading,
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
