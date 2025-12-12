// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard.jsx';
import { fetchArticles } from '../api/client.js';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [clickedCardId, setClickedCardId] = useState(null);

  // Fetch initial articles
  useEffect(() => {
    const fetchInitialArticles = async () => {
      const data = await fetchArticles();
      const articlesWithId = data.map((article, idx) => ({
        ...article,
        id: article.id ?? idx,
      }));
      setArticles(articlesWithId);
    };

    fetchInitialArticles();
  }, []);

  // WebSocket for real-time updates
  useEffect(() => {
    // Hardcoded URL for production, localhost for dev
    const WS_URL =
      import.meta.env.MODE === "development"
        ? "ws://localhost:8080"
        : "ws://16.16.67.98:3000";

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => console.log("Frontend: WebSocket connected");
    ws.onclose = () => console.log("Frontend: WebSocket disconnected");

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "new_article" && Array.isArray(msg.data)) {
          const newArticles = msg.data.map((article, idx) => ({
            ...article,
            id: article.id ?? `ws-${Date.now()}-${idx}`,
          }));
          setArticles((prev) => [...prev, ...newArticles]);
        }
      } catch (err) {
        console.error("WebSocket message parsing error:", err);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="container-grid">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
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
 