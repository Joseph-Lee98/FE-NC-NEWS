import React, { useState, useContext } from "react";
import styles from "./Commentcard.module.css";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import { AppContext } from "../../contexts/AppContext";

const CommentCard = ({ comment }) => {
  const {
    isAuthenticated,
    user,
    updateComment,
    removeComment,
    comments,
    setComments,
    articles,
    setArticles,
    setArticle,
  } = useContext(AppContext);

  const [errorVoting, setErrorVoting] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [errorDeletingComment, setErrorDeletingComment] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const commentId = comment.comment_id;

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this comment? This action cannot be undone."
      )
    ) {
      setErrorDeletingComment("");
      setIsDeleting(true);
      const updatedComments = comments.filter(
        (comment) => comment.comment_id !== commentId
      );
      const updatedArticles = (prevArticles) =>
        prevArticles.map((article) =>
          article.article_id === comment.article_id
            ? { ...article, comment_count: article.comment_count - 1 }
            : article
        );
      try {
        await removeComment(commentId);
        setComments(updatedComments);
        setArticle((prevArticle) => ({
          ...prevArticle,
          comment_count: prevArticle.comment_count - 1,
        }));
        setArticles(updatedArticles);
      } catch (error) {
        setErrorDeletingComment("Failed to delete comment. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleUpvote = async () => {
    if (downvoted) return;
    if (!upvoted) {
      setIsVoting(true);
      setErrorVoting("");
      const copyComments = [...comments];
      const updatedComments = (prevComments) =>
        prevComments.map((comment) =>
          comment.comment_id === commentId
            ? { ...comment, votes: comment.votes + 1 }
            : comment
        );
      try {
        setComments(updatedComments);
        setUpvoted(true);
        await updateComment(commentId, 1);
      } catch (error) {
        setErrorVoting("Failed to vote on comment. Please try again.");
        setComments(copyComments);
        setUpvoted(false);
      } finally {
        setIsVoting(false);
      }
    }
    if (upvoted) {
      setIsVoting(true);
      setErrorVoting("");
      const copyComments = [...comments];
      const updatedComments = (prevComments) =>
        prevComments.map((comment) =>
          comment.comment_id === commentId
            ? { ...comment, votes: comment.votes - 1 }
            : comment
        );
      try {
        setComments(updatedComments);
        setUpvoted(false);
        await updateComment(commentId, -1);
      } catch (error) {
        setErrorVoting("Failed to vote on comment. Please try again.");
        setComments(copyComments);
        setUpvoted(true);
      } finally {
        setIsVoting(false);
      }
    }
  };

  const handleDownvote = async () => {
    if (upvoted) return;
    if (!downvoted) {
      setIsVoting(true);
      setErrorVoting("");
      const copyComments = [...comments];
      const updatedComments = (prevComments) =>
        prevComments.map((comment) =>
          comment.comment_id === commentId
            ? { ...comment, votes: comment.votes - 1 }
            : comment
        );
      try {
        setComments(updatedComments);
        setDownvoted(true);
        await updateComment(commentId, -1);
      } catch (error) {
        setErrorVoting("Failed to vote on comment. Please try again.");
        setComments(copyComments);
        setDownvoted(false);
      } finally {
        setIsVoting(false);
      }
    }
    if (downvoted) {
      setIsVoting(true);
      setErrorVoting("");
      const copyComments = [...comments];
      const updatedComments = (prevComments) =>
        prevComments.map((comment) =>
          comment.comment_id === commentId
            ? { ...comment, votes: comment.votes + 1 }
            : comment
        );
      try {
        setComments(updatedComments);
        setDownvoted(false);
        await updateComment(commentId, 1);
      } catch (error) {
        setErrorVoting("Failed to vote on comment. Please try again.");
        setComments(copyComments);
        setDownvoted(true);
      } finally {
        setIsVoting(false);
      }
    }
  };

  const canDelete =
    (user?.username && comment.author && user?.username === comment.author) ||
    user?.role === "admin";

  return (
    <div
      className={`${styles.commentCard} ${
        comment.isPlaceholder ? styles.disabledCommentCard : ""
      }`}
    >
      <p className={styles.commentBody}>{comment.body}</p>
      <div className={styles.commentDetails}>
        <span className={styles.commentAuthor}>Author: {comment.author}</span>
        <span className={styles.commentVotes}>Votes: {comment.votes}</span>
        <span className={styles.commentDate}>
          Created at: {new Date(comment.created_at).toLocaleDateString()}
        </span>
      </div>
      {isAuthenticated && !comment.isPlaceholder && (
        <div className={styles.actionContainer}>
          <div className={styles.votingContainer}>
            <ThumbUpAltOutlinedIcon
              onClick={handleUpvote}
              className={`${styles.voteIcon} ${upvoted ? styles.upvoted : ""}`}
            />
            <ThumbDownAltOutlinedIcon
              onClick={handleDownvote}
              className={`${styles.voteIcon} ${
                downvoted ? styles.downvoted : ""
              }`}
            />
          </div>
          {canDelete && (
            <button onClick={handleDelete} className={styles.deleteButton}>
              {isDeleting ? "Deleting comment..." : "Delete comment"}
            </button>
          )}
        </div>
      )}
      {isVoting && <p>Voting...</p>}
      {errorVoting && <p className={styles.error}>{errorVoting}</p>}
      {errorDeletingComment && (
        <p className={styles.error}>{errorDeletingComment}</p>
      )}
    </div>
  );
};

export default CommentCard;
