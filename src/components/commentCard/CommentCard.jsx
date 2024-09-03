import React from "react";
import styles from "./Commentcard.module.css";

const CommentCard = ({ comment }) => {
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
    </div>
  );
};

export default CommentCard;
