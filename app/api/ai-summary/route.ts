import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

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
You are a Senior Customer Experience Analyst preparing an executive report for business stakeholders.

Your responsibility is to analyze the customer feedback below and prepare a professional business report.

Customer Feedback:
${text}

IMPORTANT INSTRUCTIONS

• Write like a professional business analyst.
• Do NOT use Markdown syntax.
• Do NOT use # headings.
• Do NOT use ***.
• Do NOT explain your reasoning.
• Do NOT ask for more information.
• Do NOT mention AI.
• Use professional English.
• Base every conclusion only on the provided feedback.
• Keep paragraphs concise and readable.

Generate the report using the following structure.

AI Customer Feedback Report

Executive Summary

Write two or three professional paragraphs summarizing the overall customer perception.

Overall Sentiment

Include

Positive : XX%

Negative : XX%

Neutral : XX%

Then write a short assessment explaining the overall customer sentiment.

Customer Insights

Create separate paragraphs for

Overall Product Experience

Performance

Feature Usage

Critical Issues

Explain the major issues affecting customers.

Recommendations

Provide three practical recommendations that the development team should prioritize.

Business Impact

Explain how the identified issues may affect customer satisfaction, product adoption, retention, and business growth.

Overall Assessment

Give an overall product health score out of 10 and explain why.

Confidence Level

State whether confidence is Low, Medium, or High with one sentence explaining your confidence.
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

    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No AI response generated.";

    return NextResponse.json({
      summary,
    });

  } catch (error) {
    console.error(error);

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