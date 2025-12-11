import { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard.jsx';

export default function Home() {
  const [articles, setArticles] = useState([]);        // State to store articles
  const [clickedCardId, setClickedCardId] = useState(null); // State to track expanded card

  // Fetch initial articles when the component mounts
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("http://localhost:8080/articles"); // backend GET /articles
        const data = await res.json();

        // Ensure all articles have an id from the backend
        const articlesWithId = data.map((article, idx) => ({
          ...article,
          id: article.id ?? idx // fallback only if DB didn't return id (should not happen)
        }));

        setArticles(articlesWithId); // populate state with initial articles
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      }
    };

    fetchArticles();
  }, []); // empty dependency array → runs only once

  // WebSocket for real-time updates
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => console.log("Frontend: WebSocket connected");
    ws.onclose = () => console.log("Frontend: WebSocket disconnected");

    ws.onmessage = (event) => {
      console.log("Received raw WS message:", event.data);

      try {
        const msg = JSON.parse(event.data);

        if (
          msg.type === "new_article" &&
          Array.isArray(msg.data) &&
          msg.data.length > 0 &&
          msg.data[0].title &&
          msg.data[0].content
        ) {
          // Map to ensure each article has an id (from DB)
          const newArticles = msg.data.map((article, idx) => ({
            ...article,
            id: article.id ?? `ws-${Date.now()}-${idx}` // fallback unique id if missing
          }));

          // Append new articles to state
          setArticles((prev) => [...prev, ...newArticles]);
        } else {
          console.warn("Received invalid new_article message:", msg);
        }
      } catch (error) {
        console.error("WebSocket message parsing error:", error);
      }
    };

    // Cleanup on unmount
    return () => ws.close();
  }, []);

  return (
    <div className='container-grid'>
      {articles.map((article) => (
        <ArticleCard 
          key={article.id} // unique id
          title={article.title} 
          content={article.content} 
          author={article.author} 
          date={article.date}
          expanded={clickedCardId === article.id}
          onClick={() =>
            setClickedCardId(clickedCardId === article.id ? null : article.id)
          }
        />
      ))}
    </div>
  );
}
