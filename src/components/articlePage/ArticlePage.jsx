import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArticlesContext } from "../../contexts/ArticlesContext";
import styles from "./ArticlePage.module.css";

const ArticlePage = () => {
  // console.log("inside article page component");
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

  // console.log("prior to render of loading message");
  // console.log("article: ", article);
  // console.log("article_id from params: ", article_id);

  // if (isLoadingArticle) {
  // console.log("inside isLoadingArticle block");
  //   return <p>{isLoadingArticle}</p>;
  // }

  // console.log("prior to render of error message");

  if (errorFetchingArticle) {
    return <p className={styles.error}>{errorFetchingArticle}</p>;
  }

  return (
    <div className={styles.articlePageContainer}>
      {!isLoadingArticle ? (
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
      ) : (
        <p>Loading article...</p>
      )}
    </div>
  );
};

export default ArticlePage;
