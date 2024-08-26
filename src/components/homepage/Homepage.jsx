import React, { useContext, useState } from "react";
import { ArticlesContext } from "../../contexts/ArticlesContext";
import { AuthContext } from "../../contexts/AuthContext";
import ArticleCard from "../articleCard/articleCard";
import styles from "./Homepage.module.css";

const Homepage = () => {
  const { articles, topics, isLoading, addArticle, updateFilters, filters } =
    useContext(ArticlesContext);

  const { isAuthenticated } = useContext(AuthContext);

  const [newArticle, setNewArticle] = useState({
    title: "",
    body: "",
    topic: "",
    article_img_url: "", // Optional field for image URL
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle((prevArticle) => ({
      ...prevArticle,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      await addArticle(newArticle);
      setSuccessMessage("Article successfully created!");
      setNewArticle({
        title: "",
        body: "",
        topic: "",
        article_img_url: "",
      });
    } catch (error) {
      setError("Failed to create article. Please try again.");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { [name]: value };

    // Ensure order_by is included when sort_by is updated
    if (name === "sort_by" && !filters.order_by) {
      newFilters.order_by = "desc"; // Set default order if not already set
    }
    setSuccessMessage("");
    updateFilters(newFilters);
  };

  return (
    <div className={styles.homepageContainer}>
      <div className={styles.filterContainer}>
        <select
          name="topic"
          value={filters.topic || ""}
          onChange={handleFilterChange}
          className={styles.filterSelect}
        >
          <option value="">Select Topic</option>
          {topics.map((topic) => (
            <option key={topic.slug} value={topic.slug}>
              {topic.slug}
            </option>
          ))}
        </select>
        <select
          name="sort_by"
          value={filters.sort_by || "created_at"}
          onChange={handleFilterChange}
          className={styles.filterSelect}
        >
          <option value="created_at">Date</option>
          <option value="votes">Votes</option>
          <option value="comment_count">Comments</option>
        </select>
        <select
          name="order_by"
          value={filters.order_by || "desc"}
          onChange={handleFilterChange}
          className={styles.filterSelect}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {isAuthenticated && (
        <div className={styles.newArticleFormContainer}>
          <h2>Create a New Article</h2>
          {error && <p className={styles.error}>{error}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="title" className={styles.label}>
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newArticle.title}
              onChange={handleInputChange}
              className={styles.input}
              required
            />

            <label htmlFor="body" className={styles.label}>
              Body
            </label>
            <textarea
              id="body"
              name="body"
              value={newArticle.body}
              onChange={handleInputChange}
              className={styles.textarea}
              required
            />

            <label htmlFor="topic" className={styles.label}>
              Topic
            </label>
            <select
              id="topic"
              name="topic"
              value={newArticle.topic}
              onChange={handleInputChange}
              className={styles.select}
              required
            >
              <option value="">Select Topic</option>
              {topics.map((topic) => (
                <option key={topic.slug} value={topic.slug}>
                  {topic.slug}
                </option>
              ))}
            </select>

            <label htmlFor="article_img_url" className={styles.label}>
              Image URL (Optional)
            </label>
            <input
              type="text"
              id="article_img_url"
              name="article_img_url"
              value={newArticle.article_img_url}
              onChange={handleInputChange}
              className={styles.input}
            />

            <button type="submit" className={styles.button}>
              Create Article
            </button>
          </form>
        </div>
      )}

      <div className={styles.articlesContainer}>
        {isLoading ? (
          <p>Loading articles...</p>
        ) : (
          articles.map((article) => (
            <ArticleCard key={article.article_id} article={article} />
          ))
        )}
      </div>
    </div>
  );
};

export default Homepage;
