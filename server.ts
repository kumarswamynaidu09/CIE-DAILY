import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Standard types inlined or imported for backend use
import { INITIAL_ARTICLES, DRAFT_ARTICLES, INITIAL_ALERTS } from "./src/data";
import { Article, Comment, AlertNotification } from "./src/types";

// Server-side in-memory store so that updates persist within the session
let articles: Article[] = [...INITIAL_ARTICLES];
let pendingArticles: Article[] = [...DRAFT_ARTICLES];
let alerts: AlertNotification[] = [...INITIAL_ALERTS];

// Helper to lazy-initialize Gemini client to prevent crashes if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // 1. Get all articles (both approved/live and pending/rejected drafts depending on mode)
  app.get("/api/articles", (req, res) => {
    res.json({
      live: articles,
      pending: pendingArticles,
    });
  });

  // 2. Submit a new article draft
  app.post("/api/articles/submit", async (req, res) => {
    try {
      const { title, category, readTime, authorName, authorRole, content, tags, customAiSummary } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required." });
      }

      // Generate or retrieve AI Summary
      let aiSummary = customAiSummary || "";
      
      if (!aiSummary) {
        const client = getGeminiClient();
        if (client) {
          try {
            const prompt = `Write a short, professional, academic, 1-sentence executive summary/teaser of this article for an innovation journal. It should be elegant, analytical, and fit under 150 characters. Do not output anything other than the summary itself. Do not wrap in quotes.
            Title: ${title}
            Content: ${content}`;
            
            const response = await client.models.generateContent({
              model: "gemini-3.5-flash",
              contents: prompt,
              config: {
                temperature: 0.7,
              }
            });
            
            if (response.text) {
              aiSummary = response.text.trim().replace(/^"|"$/g, "");
            }
          } catch (aiErr) {
            console.error("Gemini summarization failed:", aiErr);
            aiSummary = `An analysis into how ${category || "this industry"} is undergoing a paradigm shift through architectural innovation.`;
          }
        } else {
          aiSummary = `An analysis into how ${category || "this industry"} is undergoing a paradigm shift through architectural innovation.`;
        }
      }

      const newDraft: Article = {
        id: `draft-${Date.now()}`,
        title,
        category: category || "Innovation",
        readTime: readTime || "5 min read",
        author: {
          id: `author-${Date.now()}`,
          name: authorName || "Guest Writer",
          role: authorRole || "Contributor",
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCauA9eWRP-mK1la2d8ku3IQCUFheeOnqXcuL7WDBVe5cPcWKr_TMtprpsD69Pa17hWVcNw6tG0MudXZgWkn8M6i8PbVrThJ50GHSudMFqldlUSHKtcdXgkuYjOyiJPp3Cf1rrrBuuD9rtJK-vsFEFsNjzOJhuiF4fAUNOUfdn6QSBWUIMin_4iSSQN8-rQOffwZzqUag053j-s2vqwn0KbVBXaXBV6t4hy58rA28r0Fav0iplXCEb9u88Z_2ktlShsOXSMIGrC0W0",
        },
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOo8xVipyZkefG3ArvV-wZ8z0NnhWaxuxvhCEWyfCxZkcvpBVw2Bp0oyYwJwwDmZ4O76pnmY6PLP_wu7LENlitAFkUsjvA50SQ3GXZdxX2uzvlZSogTX-iXdDXJxhm9zIhbVv5H9Mpr-rBC96HKoFQLQa6PCU8hoUmbRjSF9foRevZ2Rd365PmNyuNAtJUMtxePU8ZLPXunSjbKZwNw8upsVhFJPIkJebyrP7c3IXzlg3338QnVJx2qAzKvAd-i3Eq_lgBqkndLkU",
        likes: 0,
        commentsCount: 0,
        commentsList: [],
        status: "pending",
        tags: tags || [category || "Innovation"],
        aiSummary,
        content
      };

      pendingArticles.unshift(newDraft);

      // Create an alert
      const newAlert: AlertNotification = {
        id: `alert-${Date.now()}`,
        title: "New Submission",
        message: `${newDraft.author.name} submitted a new draft: "${newDraft.title}".`,
        timestamp: "Just now",
        read: false,
        type: "info"
      };
      alerts.unshift(newAlert);

      res.json({ success: true, article: newDraft });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to submit draft." });
    }
  });

  // 3. Approve or reject draft
  app.post("/api/articles/action", (req, res) => {
    const { articleId, action } = req.body; // action: 'approve' | 'reject' | 'like' | 'save' | 'comment'
    
    if (!articleId) {
      return res.status(400).json({ error: "Article ID is required." });
    }

    if (action === "approve") {
      const idx = pendingArticles.findIndex((a) => a.id === articleId);
      if (idx !== -1) {
        const approved = pendingArticles[idx];
        approved.status = "approved";
        pendingArticles.splice(idx, 1);
        articles.unshift(approved);

        // Add alert
        alerts.unshift({
          id: `alert-${Date.now()}`,
          title: "Draft Approved",
          message: `"${approved.title}" was approved by editors and is now Live.`,
          timestamp: "Just now",
          read: false,
          type: "success"
        });

        return res.json({ success: true, article: approved, action });
      }
      return res.status(404).json({ error: "Pending article not found." });
    }

    if (action === "reject") {
      const idx = pendingArticles.findIndex((a) => a.id === articleId);
      if (idx !== -1) {
        const rejected = pendingArticles[idx];
        rejected.status = "rejected";
        pendingArticles.splice(idx, 1);
        // Put in pending as rejected
        pendingArticles.unshift(rejected);

        return res.json({ success: true, article: rejected, action });
      }
      return res.status(404).json({ error: "Pending article not found." });
    }

    // Toggle Like
    if (action === "like") {
      let art = articles.find((a) => a.id === articleId);
      if (!art) {
        art = pendingArticles.find((a) => a.id === articleId);
      }

      if (art) {
        if (art.hasLiked) {
          art.likes = Math.max(0, art.likes - 1);
          art.hasLiked = false;
        } else {
          art.likes += 1;
          art.hasLiked = true;
        }
        return res.json({ success: true, article: art, action });
      }
      return res.status(404).json({ error: "Article not found." });
    }

    // Toggle Save
    if (action === "save") {
      let art = articles.find((a) => a.id === articleId);
      if (!art) {
        art = pendingArticles.find((a) => a.id === articleId);
      }

      if (art) {
        art.hasSaved = !art.hasSaved;
        return res.json({ success: true, article: art, action });
      }
      return res.status(404).json({ error: "Article not found." });
    }

    // Toggle Read Status (Mark as Read / Unread)
    if (action === "read") {
      let art = articles.find((a) => a.id === articleId);
      if (!art) {
        art = pendingArticles.find((a) => a.id === articleId);
      }

      if (art) {
        art.hasRead = !art.hasRead;
        return res.json({ success: true, article: art, action });
      }
      return res.status(404).json({ error: "Article not found." });
    }

    // Post Comment
    if (action === "comment") {
      const { text, authorName, authorAvatar } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Comment text is required." });
      }

      let art = articles.find((a) => a.id === articleId);
      if (!art) {
        art = pendingArticles.find((a) => a.id === articleId);
      }

      if (art) {
        const newComment: Comment = {
          id: `comment-${Date.now()}`,
          authorName: authorName || "Innovator Guest",
          authorAvatar: authorAvatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCauA9eWRP-mK1la2d8ku3IQCUFheeOnqXcuL7WDBVe5cPcWKr_TMtprpsD69Pa17hWVcNw6tG0MudXZgWkn8M6i8PbVrThJ50GHSudMFqldlUSHKtcdXgkuYjOyiJPp3Cf1rrrBuuD9rtJK-vsFEFsNjzOJhuiF4fAUNOUfdn6QSBWUIMin_4iSSQN8-rQOffwZzqUag053j-s2vqwn0KbVBXaXBV6t4hy58rA28r0Fav0iplXCEb9u88Z_2ktlShsOXSMIGrC0W0",
          text,
          timestamp: "Just now",
        };
        art.commentsList.push(newComment);
        art.commentsCount = art.commentsList.length;
        return res.json({ success: true, article: art, action });
      }
      return res.status(404).json({ error: "Article not found." });
    }

    res.status(400).json({ error: "Invalid action." });
  });

  // 4. Get Alerts
  app.get("/api/alerts", (req, res) => {
    res.json(alerts);
  });

  // 5. Mark Alerts read
  app.post("/api/alerts/read", (req, res) => {
    alerts.forEach((a) => (a.read = true));
    res.json({ success: true, alerts });
  });

  // 6. Direct Gemini generate summary route for preview/editor usage
  app.post("/api/gemini/summarize", async (req, res) => {
    try {
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required." });
      }

      const client = getGeminiClient();
      if (!client) {
        return res.json({
          summary: `This paper presents a detailed look into "${title}" and explores its long-term strategic implications in practical domains.`
        });
      }

      const prompt = `Write a short, highly professional, 1-sentence analytical AI summary of this article draft. It should be elegant, academic, and under 150 characters.
      Title: ${title}
      Content: ${content}`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const summaryText = response.text ? response.text.trim().replace(/^"|"$/g, "") : "";
      res.json({ summary: summaryText });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to generate AI summary." });
    }
  });

  // Vite development integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
