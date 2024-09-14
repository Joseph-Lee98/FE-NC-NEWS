import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../contexts/AppContext";
import ArticleCard from "../articlecard/Articlecard";
import styles from "./Homepage.module.css";
import { v4 as uuidv4 } from "uuid";

const HomePage = () => {
  const {
    articles,
    topics,
    isLoadingArticles,
    isLoadingTopics,
    addArticle,
    updateFilters,
    filters,
    setArticles,
    errorFetchingArticles,
    errorFetchingTopics,
    isAuthenticated,
    user,
  } = useContext(AppContext);

  const [newArticle, setNewArticle] = useState({
    title: "",
    body: "",
    topic: "",
    article_img_url: "",
  });
  const [errorPosting, setErrorPosting] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (successMessage) {
      setSuccessMessage("");
    }
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle((prevArticle) => ({
      ...prevArticle,
      [name]: value || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorPosting("");
    setSuccessMessage("");
    setIsPosting("Posting article...");
    const tempId = uuidv4();
    const placeholderArticle = {
      ...newArticle,
      article_id: tempId,
      author: user.username,
      created_at: new Date().toISOString(),
      votes: 0,
      comment_count: 0,
      isPlaceholder: true,
    };
    const articlePendingPosting = {
      ...newArticle,
      article_img_url:
        newArticle.article_img_url !== ""
          ? newArticle.article_img_url
          : undefined,
    };
    const copyArticles = [...articles];
    if (placeholderArticle.topic === filters.topic || !filters.topic)
      setArticles((prevArticles) => [placeholderArticle, ...prevArticles]);

    try {
      const postedArticle = await addArticle(articlePendingPosting);
      setSuccessMessage("Article successfully created!");
      setNewArticle({
        title: "",
        body: "",
        topic: "",
        article_img_url: "",
      });
      if (postedArticle.topic === filters.topic || !filters.topic) {
        setArticles((prevArticles) =>
          prevArticles.map((article) =>
            article.isPlaceholder ? postedArticle : article
          )
        );
      }
    } catch (error) {
      setErrorPosting("Failed to create article. Please try again.");
      setArticles(copyArticles);
    } finally {
      setIsPosting("");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { [name]: value };

    // Ensure order_by is included when sort_by is updated
    if (name === "sort_by" && !filters.order_by) {
      newFilters.order_by = "desc"; // Set default order if not already set
    }
    updateFilters(newFilters);
  };

  return (
    <div className={styles.homepageContainer}>
      {errorFetchingArticles && (
        <p className={styles.error}>{errorFetchingArticles}</p>
      )}
      {errorFetchingTopics && (
        <p className={styles.error}>{errorFetchingTopics}</p>
      )}
      {isLoadingArticles && <p>Loading articles...</p>}
      {isLoadingTopics && <p>Loading topics...</p>}
      {!errorFetchingArticles &&
        !errorFetchingTopics &&
        !isLoadingArticles &&
        !isLoadingTopics && (
          <>
            {isAuthenticated && (
              <div className={styles.newArticleFormContainer}>
                <h2>Create a New Article</h2>
                {errorPosting && <p className={styles.error}>{errorPosting}</p>}
                {successMessage && (
                  <p className={styles.success}>{successMessage}</p>
                )}
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

                  <button
                    type="submit"
                    className={styles.button}
                    disabled={!!isPosting} // Disable button if isPosting is truthy
                  >
                    {isPosting ? "Creating Article..." : "Create Article"}
                  </button>
                </form>
              </div>
            )}
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
            <div className={styles.articlesContainer}>
              {articles.map((article) => (
                <ArticleCard key={article.article_id} article={article} />
              ))}
            </div>
          </>
        )}
    </div>
  );
};

export default HomePage;
