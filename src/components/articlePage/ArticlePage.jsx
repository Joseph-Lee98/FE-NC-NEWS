import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArticlesContext } from "../../contexts/ArticlesContext";
import styles from "./ArticlePage.module.css";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import { AuthContext } from "../../contexts/AuthContext";

const ArticlePage = () => {
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
  } = useContext(ArticlesContext);

  const { isAuthenticated } = useContext(AuthContext);

  const [errorVoting, setErrorVoting] = useState("");
  const [isVoting, setIsVoting] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  useEffect(() => {
    setArticleId(article_id);

    return () => {
      setArticleId(null); // Reset articleId when the component unmounts
    };
  }, [article_id, setArticleId]);

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
            )}
            {isVoting && <p>Voting on article...</p>}
            {errorVoting && <p className={styles.error}>{errorVoting}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default ArticlePage;
