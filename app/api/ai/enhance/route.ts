// app/api/ai/enhance/route.ts
import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Missing note content.' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'deepseek/deepseek-r1-0528:free',
      messages: [
        {
          role: 'system',
          content: 'You are an expert editor. Rewrite the note to improve clarity and structure using plain text only (no markdown, no formatting). Keep it under 100 words.',
        },
        {
          role: 'user',
          content: `Please enhance this note:\n\n${content}`,
        },
      ],
      max_tokens: 1000, // ~100 words
      temperature: 0.4,
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error) {
    console.error('Enhance API error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
