import { NextResponse } from "next/server";

type Feedback = {
  content: string;
};

export async function POST(req: Request) {
  try {
    const { feedbacks }: { feedbacks: Feedback[] } =
      await req.json();

    const text = feedbacks
      .map((f) => f.content)
      .join("\n");

    const prompt = `
You are an AI analyst for a customer feedback system.

Analyze the following feedback and provide:

1. Overall sentiment
2. Key themes
3. Major issues
4. Actionable recommendations
5. A short executive summary

Feedback:
${text}
`;

    const res = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gemma3:4b",
          prompt,
          stream: false,
        }),
      }
    );

    const data = await res.json();

    return NextResponse.json({
      summary: data.response,
    });
  } catch {
    return NextResponse.json(
      {
        error: "AI summary failed",
      },
      {
        status: 500,
      }
    );
  }
}