import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { feedbacks } = await req.json();

    const text = feedbacks
      .map((f: any) => f.content)
      .join("\n");

    if (!text.trim()) {
      return NextResponse.json({
        summary: "No feedback available for analysis.",
      });
    }

    const prompt = `
You are a Senior Customer Experience Analyst.

Analyze the customer feedback provided below and generate a professional business report.

Feedback Data:
${text}

Return the response using EXACTLY this format:

# Executive Summary
(2-3 concise paragraphs summarizing overall customer perception.)

# Overall Sentiment
- Positive: X%
- Negative: X%
- Neutral: X%
- Final Assessment: (One sentence)

# Key Themes
- Theme 1: Description
- Theme 2: Description
- Theme 3: Description

# Critical Issues
- Issue 1
- Issue 2
- Issue 3

# Recommendations
- Recommendation 1
- Recommendation 2
- Recommendation 3

# Business Impact
(Explain how these findings could affect customer satisfaction, retention, or growth.)

IMPORTANT RULES:
- Never ask for additional information.
- Never say "I need more context."
- Never explain how you would perform the analysis.
- Treat the provided feedback as the complete dataset.
- Write in a professional executive-report style.
- Keep the response concise, clear, and actionable.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    const data = await response.json();

    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({
      summary: summary || "No AI response generated.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "AI summary failed" },
      { status: 500 }
    );
  }
}