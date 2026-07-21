import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    }

    const client = getGeminiClient();
    if (!client) {
      return NextResponse.json({
        summary: `This paper presents a detailed look into "${title}" and explores its long-term strategic implications in practical domains.`,
      });
    }

    const prompt = `Write a short, highly professional, 1-sentence analytical AI summary of this article draft. It should be elegant, academic, and under 150 characters.
    Title: ${title}
    Content: ${content}`;

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const summaryText = response.text ? response.text.trim().replace(/^"|"$/g, "") : "";
    return NextResponse.json({ summary: summaryText });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate AI summary." }, { status: 500 });
  }
}
