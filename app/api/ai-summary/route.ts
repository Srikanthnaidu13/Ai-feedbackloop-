import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { feedbacks } = await req.json();

    console.log("Received feedbacks:", feedbacks);

    const text = feedbacks
      .map((f: any) => f.content)
      .join("\n");

    console.log("Generated text:", text);

    // ...

    const prompt = `
You are an AI analyst.

Analyze:
1. Overall sentiment
2. Key themes
3. Major issues
4. Recommendations
5. Executive summary

Feedback:
${text}
`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    console.log("Gemini status:", res.status);

    const data = await res.json();

    console.log(
      JSON.stringify(data, null, 2)
    );

    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            data.error?.message ||
            "Gemini request failed",
        },
        {
          status: res.status,
        }
      );
    }

    return NextResponse.json({
      summary:
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "No AI response generated",
    });
  } catch (err) {
    console.error(err);

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