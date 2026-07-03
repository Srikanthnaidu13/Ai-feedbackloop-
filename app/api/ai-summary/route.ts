import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { feedbacks } = await req.json();

    const text = feedbacks
      .map((f: { content: string }) => f.content)
      .join("\n");

    if (!text.trim()) {
      return NextResponse.json({
        summary: "No feedback available.",
      });
    }

    const prompt = `
You are an AI analyst for a customer feedback platform.

Analyze the following feedback and provide:

1. Overall sentiment
2. Key themes
3. Major issues
4. Recommendations
5. Executive summary

Feedback:
${text}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const result = await response.json();

    console.log("Gemini status:", response.status);
    console.log(
      "Gemini result:",
      JSON.stringify(result, null, 2)
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            result.error?.message ||
            "Gemini API request failed",
        },
        {
          status: 500,
        }
      );
    }

    const summary =
      result?.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({
      summary: summary || "No AI response generated",
    });
  } catch (error) {
    console.error("AI ERROR:", error);

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