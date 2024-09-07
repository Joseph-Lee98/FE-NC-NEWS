import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ArticlePage.module.css";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import { AppContext } from "../../contexts/AppContext";
import CommentCard from "../commentcard/Commentcard";
import { v4 as uuidv4 } from "uuid";

const ArticlePage = () => {
  const navigate = useNavigate();
  const { article_id } = useParams();
  const article_idNumber = Number(article_id);
  const {
    article,
    setArticle,
    articles,
    setArticles,
    isLoadingArticle,
    errorFetchingArticle,
    setArticleId,
    updateArticle,
    removeArticle,
    addComment,
    isAuthenticated,
    user,
    comments,
    setComments,
    isLoadingComments,
    errorFetchingComments,
  } = useContext(AppContext);

  const [errorVoting, setErrorVoting] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorDeletingArticle, setErrorDeletingArticle] = useState("");
  const [newComment, setNewComment] = useState({
    body: "",
  });
  const [errorPosting, setErrorPosting] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    setArticleId(article_id);

    return () => {
      setArticleId(null); // Reset articleId when the component unmounts
    };
  }, [article_id, setArticleId]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setNewComment({ body: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorPosting("");
    setSuccessMessage("");
    setIsPosting("Posting comment...");
    const tempId = uuidv4();
    const placeholderComment = {
      ...newComment,
      article_id: article_idNumber,
      comment_id: tempId,
      author: user.username,
      created_at: new Date().toISOString(),
      votes: 0,
      isPlaceholder: true,
    };
    const copyComments = [...comments];
    const copyArticle = { ...article };
    const copyArticles = [...articles];

    const updatedArticles = (prevArticles) =>
      prevArticles.map((article) =>
        article.article_id === article_idNumber
          ? { ...article, comment_count: article.comment_count + 1 }
          : article
      );

    setArticles(updatedArticles);
    setArticle((prevArticle) => ({
      ...article,
      comment_count: article.comment_count + 1,
    }));
    setComments((prevComments) => [placeholderComment, ...prevComments]);
    try {
      const postedComment = await addComment(article_idNumber, newComment);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.isPlaceholder ? postedComment : comment
        )
      );
      setNewComment({
        body: "",
      });
      setSuccessMessage("Comment successfully created!");
    } catch (error) {
      setArticles(copyArticles);
      setArticle(copyArticle);
      setComments(copyComments);
      setErrorPosting("Failed to create comment. Please try again.");
    } finally {
      setIsPosting("");
    }
  };

  const handleUpvote = async () => {
    if (downvoted) return;
    if (!upvoted) {
      setErrorVoting("");
      setIsVoting(true);
      const copyArticles = [...articles];
      const copyArticle = { ...article };
      const upvotedArticle = { ...article, votes: article.votes + 1 };
      const updatedArticles = articles.map((article) =>
        article.article_id === article_idNumber ? upvotedArticle : article
      );
      try {
        setArticle(upvotedArticle);
        setArticles(updatedArticles);
        setUpvoted(true);
        await updateArticle(article_id, 1);
      } catch (error) {
        setErrorVoting("Failed to vote on article. Please try again.");
        setArticle(copyArticle);
        setArticles(copyArticles);
        setUpvoted(false);
      } finally {
        setIsVoting(false);
      }
    } else {
      setErrorVoting("");
      setIsVoting(true);
      const copyArticles = [...articles];
      const copyArticle = { ...article };
      const unvotedArticle = { ...article, votes: article.votes - 1 };
      const updatedArticles = articles.map((article) =>
        article.article_id === article_idNumber ? unvotedArticle : article
      );
      try {
        setArticle(unvotedArticle);
        setArticles(updatedArticles);
        setUpvoted(false);
        await updateArticle(article_id, -1);
      } catch (error) {
        setErrorVoting("Failed to vote on article. Please try again.");
        setArticle(copyArticle);
        setArticles(copyArticles);
        setUpvoted(true);
      } finally {
        setIsVoting(false);
      }
    }
  };

  const handleDownvote = async () => {
    if (upvoted) return;
    if (!downvoted) {
      setErrorVoting("");
      setIsVoting(true);
      const copyArticles = [...articles];
      const copyArticle = { ...article };
      const downvotedArticle = { ...article, votes: article.votes - 1 };
      const updatedArticles = articles.map((article) =>
        article.article_id === article_idNumber ? downvotedArticle : article
      );
      try {
        setArticle(downvotedArticle);
        setArticles(updatedArticles);
        setDownvoted(true);
        await updateArticle(article_id, -1);
      } catch (error) {
        setErrorVoting("Failed to vote on article. Please try again.");
        setArticle(copyArticle);
        setArticles(copyArticles);
        setDownvoted(false);
      } finally {
        setIsVoting(false);
      }
    } else {
      setErrorVoting("");
      setIsVoting(true);
      const copyArticles = [...articles];
      const copyArticle = { ...article };
      const unvotedArticle = { ...article, votes: article.votes + 1 };
      const updatedArticles = articles.map((article) =>
        article.article_id === article_idNumber ? unvotedArticle : article
      );
      try {
        setArticle(unvotedArticle);
        setArticles(updatedArticles);
        setDownvoted(false);
        await updateArticle(article_id, 1);
      } catch (error) {
        setErrorVoting("Failed to vote on article. Please try again.");
        setArticle(copyArticle);
        setArticles(copyArticles);
        setDownvoted(true);
      } finally {
        setIsVoting(false);
      }
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this article? This action cannot be undone."
      )
    ) {
      setErrorDeletingArticle("");
      setIsDeleting(true);
      const updatedArticles = articles.filter(
        (article) => article.article_id !== article_idNumber
      );
      try {
        await removeArticle(article_idNumber);
        setArticle({});
        setArticles(updatedArticles);
        navigate("/");
      } catch (error) {
        setErrorDeletingArticle("Failed to delete article. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const canDelete =
    (user?.username && article.author && user?.username === article.author) ||
    user?.role === "admin";

  return (
    <div className={styles.articlePageContainer}>
      {errorFetchingArticle && (
        <p className={styles.error}>{errorFetchingArticle}</p>
      )}
      {isLoadingArticle && <p>Loading article...</p>}
      {!errorFetchingArticle && !isLoadingArticle && (
        <>
          <div className={styles.articleContent}>
            <img
              src={article.article_img_url}
              alt={article.title}
              className={styles.articleImage}
            />
            <h1 className={styles.articleTitle}>{article.title}</h1>
            <p className={styles.articleBody}>{article.body}</p>
            <div className={styles.articleDetails}>
              <span>Author: {article.author}</span>
              <span>Votes: {article.votes}</span>
              <span>Comments: {article.comment_count}</span>
            </div>
            {isAuthenticated && (
              <div className={styles.actionContainer}>
                <div className={styles.votingContainer}>
                  <ThumbUpAltOutlinedIcon
                    onClick={handleUpvote}
                    className={`${styles.voteIcon} ${
                      upvoted ? styles.upvoted : ""
                    }`}
                  />
                  <ThumbDownAltOutlinedIcon
                    onClick={handleDownvote}
                    className={`${styles.voteIcon} ${
                      downvoted ? styles.downvoted : ""
                    }`}
                  />
                </div>
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    className={styles.deleteButton}
                  >
                    {isDeleting ? "Deleting article..." : "Delete article"}
                  </button>
                )}
              </div>
            )}

            {isVoting && <p>Voting on article...</p>}
            {errorVoting && <p className={styles.error}>{errorVoting}</p>}
            {errorDeletingArticle && (
              <p className={styles.error}>{errorDeletingArticle}</p>
            )}
          </div>
          {isAuthenticated && (
            <div className={styles.newCommentFormContainer}>
              <h2>Create a New Comment</h2>
              {errorPosting && <p className={styles.error}>{errorPosting}</p>}
              {successMessage && (
                <p className={styles.success}>{successMessage}</p>
              )}
              <form onSubmit={handleSubmit} className={styles.form}>
                <label htmlFor="comment" className={styles.label}>
                  Comment
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={newComment.body}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  required
                />
                <button
                  type="submit"
                  className={styles.button}
                  disabled={!!isPosting} // Disable button if isPosting is truthy
                >
                  {isPosting ? "Creating Comment..." : "Create Comment"}
                </button>
              </form>
            </div>
          )}
          <div className={styles.commentsContainer}>
            <h2>Comments</h2>
            {errorFetchingComments && (
              <p className={styles.error}>{errorFetchingComments}</p>
            )}
            {isLoadingComments && <p>Loading comments...</p>}
            {!errorFetchingComments &&
            !isLoadingComments &&
            comments.length > 0 ? (
              comments.map((comment) => (
                <CommentCard key={comment.comment_id} comment={comment} />
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ArticlePage;
