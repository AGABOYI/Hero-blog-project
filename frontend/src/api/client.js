// API client for backend requests
const BASE_URL = "http://localhost:8080";

export async function fetchArticles() {
  try {
    const res = await fetch(`${BASE_URL}/articles`);
    if (!res.ok) throw new Error("Failed to fetch articles");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}
