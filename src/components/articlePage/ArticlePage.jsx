import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArticlesContext } from "../../contexts/ArticlesContext";
import styles from "./ArticlePage.module.css";

const ArticlePage = () => {
  const { article, isLoadingArticle, errorFetchingArticle } =
    useContext(ArticlesContext);
  const { article_id } = useParams();
  const { setArticleId } = useContext(ArticlesContext);

  useEffect(() => {
    setArticleId(article_id);

    return () => {
      setArticleId(null); // Reset articleId when the component unmounts
    };
  }, [article_id, setArticleId]);

  return (
    <div className={styles.articlePageContainer}>
      {errorFetchingArticle && (
        <p className={styles.error}>{errorFetchingArticle}</p>
      )}
      {isLoadingArticle && <p>Loading article...</p>}
      {!errorFetchingArticle &&
        !isLoadingArticle(
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
            </div>
          </>
        )}
    </div>
  );
};

export default ArticlePage;
