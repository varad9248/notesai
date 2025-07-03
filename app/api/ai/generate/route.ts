import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that creates notes in plain text only. No markdown, no formatting. Keep the note simple, clear, and under 100 words.",
        },
        {
          role: "user",
          content: `Write a plain text note about: ${prompt}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.6,
    });

    const content = completion.choices[0]?.message?.content?.trim();

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error("Error generating note:", error.message || error);
    return NextResponse.json({ error: "Failed to generate note" }, { status: 500 });
  }
}
