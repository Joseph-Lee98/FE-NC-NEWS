import axios from "axios";

const api = axios.create({
  baseURL: "https://be-nc-news-q4om.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error response is a 401 with an "Invalid token" message
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "Invalid token"
    ) {
      // Clear JWT and user info from local storage
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");

      // Redirect to login page
      const navigate = useNavigate();
      navigate("/login");

      // Return a rejected promise with the error to stop further execution
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// Fetch all topics
export const fetchTopics = async () => {
  try {
    const response = await api.get("/topics");
    return response.data;
  } catch (error) {
    console.error("Error fetching topics:", error);
    throw error;
  }
};

// Fetch all articles with optional filters
export const fetchArticles = async (filters = {}) => {
  try {
    const response = await api.get("/articles", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

// Fetch a single article by ID
export const fetchArticleById = async (articleId) => {
  try {
    const response = await api.get(`/articles/${articleId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching article with ID ${articleId}:`, error);
    throw error;
  }
};

// Post a new article
export const postArticle = async (articleData) => {
  try {
    const response = await api.post("/articles", articleData);
    return response.data;
  } catch (error) {
    console.error("Error posting article:", error);
    throw error;
  }
};

// Update an article by ID (e.g., upvote/downvote)
export const updateArticleById = async (articleId, incVotes) => {
  try {
    const response = await api.patch(`/articles/${articleId}`, {
      inc_votes: incVotes,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating article with ID ${articleId}:`, error);
    throw error;
  }
};

// Delete an article by ID
export const deleteArticleById = async (articleId) => {
  try {
    await api.delete(`/articles/${articleId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting article with ID ${articleId}:`, error);
    throw error;
  }
};

// Fetch comments for a specific article by ID
export const fetchCommentsByArticleId = async (articleId) => {
  try {
    const response = await api.get(`/articles/${articleId}/comments`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching comments for article with ID ${articleId}:`,
      error
    );
    throw error;
  }
};

// Post a comment for a specific article
export const postCommentByArticleId = async (articleId, commentData) => {
  try {
    const response = await api.post(
      `/articles/${articleId}/comments`,
      commentData
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error posting comment for article with ID ${articleId}:`,
      error
    );
    throw error;
  }
};

// Delete a comment by ID
export const deleteCommentById = async (commentId) => {
  try {
    await api.delete(`/comments/${commentId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting comment with ID ${commentId}:`, error);
    throw error;
  }
};

// Update (e.g., upvote/downvote) a comment by ID
export const updateCommentById = async (commentId, incVotes) => {
  try {
    const response = await api.patch(`/comments/${commentId}`, {
      inc_votes: incVotes,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating comment with ID ${commentId}:`, error);
    throw error;
  }
};

// Fetch a specific user's details
export const fetchUserDetails = async (username) => {
  try {
    const response = await api.get(`/users/${username}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for user ${username}:`, error);
    throw error;
  }
};

// Login a user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/users/login", credentials);
    const { user, token } = response.data;
    localStorage.setItem("jwt", token);
    localStorage.setItem("user", JSON.stringify(user)); // Store user info
    return user;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/users", userData);
    const { user, token } = response.data;
    localStorage.setItem("jwt", token);
    localStorage.setItem("user", JSON.stringify(user)); // Store user info
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Update a user's details
export const updateUserDetails = async (username, updatedData) => {
  try {
    const response = await api.patch(`/users/${username}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with username ${username}:`, error);
    throw error;
  }
};

// Delete a user's account
export const deleteUserAccount = async (username) => {
  try {
    await api.delete(`/users/${username}`);
    localStorage.removeItem("jwt");
    return true;
  } catch (error) {
    console.error(`Error deleting account for user ${username}:`, error);
    throw error;
  }
};

// Fetch all users (admin only)
export const fetchAllUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export default api;
