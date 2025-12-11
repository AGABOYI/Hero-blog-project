import React from "react";
import "../App.css"; 

const ArticleCard = ({ title, content, expanded, onClick }) => {
  return (
    <article className="article-card">
      <h2 className="article-card-title">{title}</h2>
      <p
        className="article-card-content"
        style={{
          maxHeight: expanded
            ? "none"
            : "calc(var(--max-lines) * 1em * var(--line-height))",
        }}
      >
        {content}
      </p>
      <button className="article-card-expand-button" onClick={onClick}>
        {expanded ? "Collapse" : "Read more..."}
      </button>
    </article>
  );
};

export default ArticleCard;
