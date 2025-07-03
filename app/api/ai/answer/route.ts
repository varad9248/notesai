import { openai } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { question, notes } = await req.json();

  if (!question?.trim()) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  if (!notes || !Array.isArray(notes) || notes.length === 0) {
    return NextResponse.json({ error: "At least one note is required" }, { status: 400 });
  }

  const notesContext = notes
    .map((note: any) => `Title: ${note.title}\nContent: ${note.content}`)
    .join("\n\n---\n\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Answer the user's question briefly using the provided notes only. Keep the answer clear, plain, and under 250 words. If the answer cannot be found in the notes, say so.",
        },
        {
          role: "user",
          content: `Notes:\n\n${notesContext}\n\nQuestion: ${question}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.5,
    });

    const content = completion.choices[0]?.message?.content?.trim();

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error("Answer API error:", error.message || error);
    return NextResponse.json({ error: "Failed to generate answer" }, { status: 500 });
  }
}
