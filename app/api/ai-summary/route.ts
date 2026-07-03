import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log(
      "API KEY EXISTS:",
      !!process.env.GEMINI_API_KEY
    );

    const { feedbacks } = await req.json();

    const text = feedbacks
      .map((f: { content: string }) => f.content)
      .join("\n");

    if (!text) {
      return NextResponse.json({
        summary: "No feedback available.",
      });
    }

    const prompt = `
You are an AI analyst.

Analyze the customer feedback and provide:

1. Overall sentiment
2. Key themes
3. Main issues
4. Recommendations
5. Executive summary

Feedback:
${text}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
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

    const data = await response.json();

    // IMPORTANT: print the full response
    console.log(
      "Gemini status:",
      response.status
    );

    console.log(
      "Gemini response:",
      JSON.stringify(data, null, 2)
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.error?.message || "Gemini API failed",
        },
        {
          status: 500,
        }
      );
    }

    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

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