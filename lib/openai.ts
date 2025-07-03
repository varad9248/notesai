import OpenAI from "openai";
import { Note } from "./supabase";

// ✅ Guard against missing API key
if (!process.env.NEXT_PUBLIC_AI_API_KEY) {
  throw new Error(
    "Missing OpenRouter API key. Set NEXT_PUBLIC_AI_API_KEY in your .env.local"
  );
}

// ✅ Configure OpenAI with OpenRouter endpoint
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_AI_API_KEY,
  dangerouslyAllowBrowser: process.env.NODE_ENV === "development",
  defaultHeaders: {
    "HTTP-Referer": "https://your-site-url.com", // 🔁 Replace with your actual URL
    "X-Title": "NoteAI", // 🔁 Replace with your actual app name
  },
});

export async function generateNoteFromPrompt(prompt: string): Promise<string> {
  if (!prompt.trim()) return "No prompt provided.";

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that creates notes under 250 words in markdown format. Use clear sections, headers, and bullet points where needed. Be concise.",
        },
        {
          role: "user",
          content: `Create a short, structured note about: ${prompt}`,
        },
      ],
      max_tokens: 350, // ~250 words
      temperature: 0.7,
    });

    return (
      completion.choices[0]?.message?.content || "Failed to generate content."
    );
  } catch (error: any) {
    console.error("Error generating note:", error.message || error);
    throw new Error("Failed to generate note content");
  }
}

export async function enhanceNote(content: string): Promise<string> {
  if (!content.trim()) return "No content provided to enhance.";

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content:
            "You are an expert editor. Rewrite this note to improve clarity and structure. Keep it under 250 words. Format in markdown.",
        },
        {
          role: "user",
          content: `Please enhance this note:\n\n${content}`,
        },
      ],
      max_tokens: 350,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || content;
  } catch (error: any) {
    console.error("Error enhancing note:", error.message || error);
    throw new Error("Failed to enhance note content");
  }
}

export async function answerQuestionFromNotes(
  question: string,
  notes: Note[]
): Promise<string> {
  if (!question.trim()) return "No question provided.";
  if (!notes || notes.length === 0) return "You have no notes to search from.";

  const notesContext = notes
    .map((note) => `Title: ${note.title}\nContent: ${note.content}`)
    .join("\n\n---\n\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Use the provided notes to answer the question briefly (under 250 words). If not found, say so clearly.",
        },
        {
          role: "user",
          content: `Answer based on these notes:\n\n${notesContext}\n\nQuestion: ${question}`,
        },
      ],
      max_tokens: 350,
      temperature: 0.5,
    });

    return (
      completion.choices[0]?.message?.content ||
      "I couldn't find relevant information in your notes to answer that question."
    );
  } catch (error: any) {
    console.error("Error answering question:", error.message || error);
    throw new Error("Failed to answer question");
  }
}

// ✅ Export Note type
export type { Note } from "./supabase";
