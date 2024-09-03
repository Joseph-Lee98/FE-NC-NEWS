import axios from "axios";

const api = axios.create({
  baseURL: "https://be-nc-news-q4om.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthHeader = () => {
  const token = localStorage.getItem("jwt");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchArticles = (filters) => {
  return api.get("/articles", { params: filters });
};

export const fetchArticleById = (articleId) => {
  return api.get(`/articles/${articleId}`);
};

export const fetchTopics = () => {
  return api.get("/topics");
};

export const postArticle = (articleData) => {
  return api.post("/articles", articleData, {
    headers: getAuthHeader(),
  });
};

export const updateArticleById = (articleId, incVotes) => {
  return api.patch(
    `/articles/${articleId}`,
    { inc_votes: incVotes },
    {
      headers: getAuthHeader(),
    }
  );
};

export const deleteArticleById = (articleId) => {
  return api.delete(`/articles/${articleId}`, {
    headers: getAuthHeader(),
  });
};

export const loginUser = (credentials) => {
  return api.post("/users/login", credentials, {
    headers: getAuthHeader(),
  });
};

export const registerUser = (userData) => {
  return api.post("/users", userData, {
    headers: getAuthHeader(),
  });
};

export const deleteUserAccount = (username) => {
  return api.delete(`/users/${username}`, {
    headers: getAuthHeader(),
  });
};

export default api;
