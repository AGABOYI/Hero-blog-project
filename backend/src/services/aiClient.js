import fetch from "node-fetch";
import '../config.js';

const apiKey = process.env.HERO_OPENROUTER_API_KEY;

/**
 * Prompts for AI to generate articles.
 * - promptNumber 1 → initial 3 articles
 * - promptNumber 2 → daily 1 article
 */
const prompts = {
  1: `
Generate exactly 3 blog articles.  
Return ONLY valid JSON:

[
    { "title": "...", "content": "...", "author": "..." },
    { "title": "...", "content": "...", "author": "..." },
    { "title": "...", "content": "...", "author": "..." }
]

Rules:
    - title: 2-3 words
    - content: 3+ paragraphs, 150-300 words
    - author: fictional
    - no date, no explanation, no markdown
`,
  2: `
Generate exactly 1 blog article.  
Return ONLY valid JSON:

[
    { "title": "...", "content": "...", "author": "..." }
]

Rules:
    - title: 2-4 words
    - content: 3+ paragraphs, 150-300 words
    - author: fictional
    - no date, no explanation, no markdown
`
};

/**
 * Cleans AI response from markdown code fences ```json ... ```
 */
function cleanAIResponse(text) {
  return text
    .replace(/```json/g, "") // remove ```json
    .replace(/```/g, "")     // remove ```
    .trim();
}

/**
 * Fetches articles from the AI API (OpenRouter) with validation.
 * Provides a dummy fallback if AI response is invalid or parsing fails.
 *
 * @param {number} promptNumber - 1 for initial setup, 2 for daily cron
 * @returns {Array} - Returns validated array of articles (from AI or dummy fallback)
 */
export async function fetchArticlesFromAI(promptNumber) {
  const prompt = prompts[promptNumber];

  let articles = [];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "tngtech/deepseek-r1t2-chimera:free",
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) throw new Error(`AI API returned status ${response.status}`);

    const data = await response.json();

    // Clean AI response before parsing
    const cleanText = cleanAIResponse(data.choices[0].message.content);

    try {
      articles = JSON.parse(cleanText);
    } catch (err) {
      console.error("Failed to parse AI JSON, using fallback data:", cleanText);

      // Fallback: create our own JSON object
      if (promptNumber === 1) {
        articles = [
          { title: "Fallback Article 1", content: "This is dummy content.", author: "System" },
          { title: "Fallback Article 2", content: "This is dummy content.", author: "System" },
          { title: "Fallback Article 3", content: "This is dummy content.", author: "System" },
        ];
      } else if (promptNumber === 2) {
        articles = [
          { title: "Fallback Article", content: "This is dummy content.", author: "System" }
        ];
      }
    }

    // Validation: ensure each article has title, content, author
    articles = articles.map((article, index) => ({
      title: article?.title?.trim() || `Fallback Title ${index + 1}`,
      content: article?.content?.trim() || "Fallback content",
      author: article?.author?.trim() || "System",
    }));

    return articles;

  } catch (error) {
    console.error("Error fetching AI data, using fallback articles:", error);

    // If the whole fetch fails,  return fallback
    if (promptNumber === 1) {
      return [
        { title: "Fallback Article 1", content: "This is dummy content.", author: "System" },
        { title: "Fallback Article 2", content: "This is dummy content.", author: "System" },
        { title: "Fallback Article 3", content: "This is dummy content.", author: "System" },
      ];
    } else if (promptNumber === 2) {
      return [
        { title: "Fallback Article", content: "This is dummy content.", author: "System" }
      ];
    }
  }
}
