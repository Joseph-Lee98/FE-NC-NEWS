import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Articlecard.module.css";

const ArticleCard = ({ article }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!article.isPlaceholder) navigate(`/article/${article.article_id}`);
  };

  return (
    <div
      className={`${styles.articleCard} ${
        article.isPlaceholder ? styles.disabledArticleCard : ""
      }`}
      onClick={handleClick}
    >
      {article.article_img_url && (
        <img
          src={article.article_img_url}
          alt={article.title}
          className={styles.articleImage}
        />
      )}
      <div className={styles.articleContent}>
        <h3>{article.title}</h3>
        <p>Author: {article.author}</p>
        <p>Topic: {article.topic}</p>
        <p>Votes: {article.votes}</p>
        <p>Comments: {article.comment_count}</p>
        <p>Created at: {new Date(article.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ArticleCard;
