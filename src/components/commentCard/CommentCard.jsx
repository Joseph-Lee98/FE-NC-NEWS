import React, { useState, useContext } from "react";
import styles from "./Commentcard.module.css";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import { AppContext } from "../../contexts/AppContext";

const CommentCard = ({ comment }) => {
  const { isAuthenticated, updateComment, comments, setComments } =
    useContext(AppContext);

  const [errorVoting, setErrorVoting] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  const commentId = comment.comment_id;

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

  return (
    <div className={styles.commentCard}>
      <p className={styles.commentBody}>{comment.body}</p>
      <div className={styles.commentDetails}>
        <span className={styles.commentAuthor}>Author: {comment.author}</span>
        <span className={styles.commentVotes}>Votes: {comment.votes}</span>
        <span className={styles.commentDate}>
          Created at: {new Date(comment.created_at).toLocaleDateString()}
        </span>
      </div>
      {isAuthenticated && (
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
        </div>
      )}
      {isVoting && <p>Voting...</p>}
      {errorVoting && <p className={styles.error}>{errorVoting}</p>}
    </div>
  );
};

export default CommentCard;
