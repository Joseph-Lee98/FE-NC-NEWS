import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/useApi";
// import {
//   fetchArticles,
//   fetchArticleById,
//   fetchTopics,
//   postArticle,
//   updateArticleById,
//   deleteArticleById,
//   postCommentByArticleId,
//   fetchCommentsByArticleId,
//   deleteCommentById,
// } from "../utils/api";
import { AuthContext } from "./AuthContext";

export const ArticlesContext = createContext();

export const ArticlesProvider = ({ children }) => {
  // const api = useApi();

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

  const navigate = useNavigate();

  const handleAuthError = (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "Invalid token"
    ) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      navigate("/login");
    }
    throw error; // Re-throw the error to handle it in the UI if necessary
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("jwt");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // useEffect(() => {
  //   if (!articleId) return;
  //   const loadArticle = async () => {
  //     try {
  //       setErrorFetchingArticle("");
  //       setIsLoadingArticle(true);
  //       const fetchedArticle = await fetchArticleById(articleId);
  //       setArticle(fetchedArticle);
  //     } catch (error) {
  //       console.error("Error loading article:", error);
  //       setErrorFetchingArticle(
  //         "Failed to load article, please try refreshing the page"
  //       );
  //     } finally {
  //       setIsLoadingArticle(false);
  //     }
  //   };
  //   loadArticle();
  // }, [articleId]);

  useEffect(() => {
    if (!articleId) return;
    const loadArticle = async () => {
      try {
        setErrorFetchingArticle("");
        setIsLoadingArticle(true);
        const response = await api.get(`/articles/${articleId}`);
        setArticle(response.data);
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
        const topicsData = await api.get("/topics");
        setTopics(topicsData.data);
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

  // useEffect(() => {
  //   const loadArticles = async () => {
  //     try {
  //       setErrorFetchingArticles("");
  //       setIsLoadingArticles(true);
  //       const articlesData = await fetchArticles(filters);
  //       setArticles(articlesData);
  //     } catch (error) {
  //       console.error("Failed to fetch articles:", error);
  //       setErrorFetchingArticles(
  //         "Failed to load articles, please try refreshing the page"
  //       );
  //     } finally {
  //       setIsLoadingArticles(false);
  //     }
  //   };

  //   loadArticles();
  // }, [filters]);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setErrorFetchingArticles("");
        setIsLoadingArticles(true);
        const response = await api.get("/articles", { params: filters });
        setArticles(response.data);
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

  // const refreshArticles = async () => {
  //   try {
  //     setIsLoading(true);
  //     const articlesData = await fetchArticles(filters);
  //     setArticles(articlesData);
  //   } catch (error) {
  //     console.error("Failed to refresh articles:", error);
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const updateFilters = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  // const addArticle = async (articleData) => {
  //   try {
  //     const response = await postArticle(articleData);
  //     return response; // This should return the full article data with the correct article_id from the backend
  //   } catch (error) {
  //     console.error("Failed to add article:", error);
  //     throw error;
  //   }
  // };

  const addArticle = async (articleData) => {
    try {
      const response = await api.post("/articles", articleData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      handleAuthError(error);
    }
  };

  // const updateArticle = async (articleId, incVotes) => {
  //   try {
  //     await updateArticleById(articleId, incVotes);
  //   } catch (error) {
  //     console.error("Failed to update article:", error);
  //     throw error;
  //   }
  // };

  const updateArticle = async (articleId, incVotes) => {
    try {
      await api.patch(
        `/articles/${articleId}`,
        { inc_votes: incVotes },
        {
          headers: getAuthHeader(),
        }
      );
    } catch (error) {
      handleAuthError(error);
    }
  };

  // const updateArticleCommentCount = (articleId, incCount) => {
  //   setArticles((prevArticles) =>
  //     prevArticles.map((article) =>
  //       article.article_id === articleId
  //         ? { ...article, comment_count: article.comment_count + incCount }
  //         : article
  //     )
  //   );
  // };

  // const removeArticle = async (articleId) => {
  //   try {
  //     await deleteArticleById(articleId);
  //   } catch (error) {
  //     console.error("Failed to delete article:", error);
  //     throw error;
  //   }
  // };

  const removeArticle = async (articleId) => {
    try {
      await api.delete(`/articles/${articleId}`, {
        headers: getAuthHeader(),
      });
    } catch (error) {
      handleAuthError(error);
    }
  };

  // const addComment = async (articleId, commentData) => {
  //   try {
  //     const newComment = await postCommentByArticleId(articleId, commentData);

  //     setArticles((prevArticles) =>
  //       prevArticles.map((article) =>
  //         article.article_id === articleId
  //           ? { ...article, comment_count: article.comment_count + 1 }
  //           : article
  //       )
  //     );
  //     return newComment;
  //   } catch (error) {
  //     console.error("Failed to add comment:", error);
  //     throw error;
  //   }
  // };

  // const deleteComment = async (commentId) => {
  //   try {
  //     await deleteCommentById(commentId);
  //   } catch (error) {
  //     console.error("Failed to delete comment:", error);
  //     throw error; // Rethrow the error to handle it in the CommentCard
  //   }
  // };

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
