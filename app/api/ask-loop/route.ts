import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Question is required.",
        },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!feedback.length) {
      return NextResponse.json({
        success: true,
        answer: "No customer feedback is available for analysis.",
      });
    }

    const context = feedback
      .map(
        (item, index) => `
Feedback ${index + 1}

Content: ${item.content}
Channel: ${item.channel ?? "Unknown"}
Sentiment: ${item.sentiment ?? "Pending"}
Theme: ${item.theme ?? "Uncategorized"}
Date: ${item.createdAt.toLocaleDateString()}
`
      )
      .join("\n--------------------------------------------------\n");

    const prompt = `
You are LOOP AI, the intelligent analytics engine of Project LOOP.

Project LOOP is an enterprise Customer Feedback Intelligence Platform designed to help organizations understand customer opinions, monitor satisfaction, identify trends, detect recurring issues, and generate business recommendations.

==================================================
YOUR ROLE
==================================================

Act as a Senior Customer Experience Analyst and Business Intelligence Consultant.

Your audience includes:

• Product Managers
• Business Executives
• Customer Success Teams
• Engineering Managers
• UX Designers

Your responsibility is to transform customer feedback into actionable business insights.

==================================================
AVAILABLE CUSTOMER FEEDBACK
==================================================

${context}

==================================================
USER QUESTION
==================================================

${question}

==================================================
RESPONSE FORMAT
==================================================

Write your response as a professional business report.

DO NOT use:

#
##
###
*
-
**
Markdown tables
Code blocks

Instead, use clean section titles exactly like this:

Executive Summary

Write 1–2 concise paragraphs answering the user's question.

Overall Assessment

Provide a short business assessment summarizing the situation.

Key Insights

1. First insight

Explain it in one paragraph.

2. Second insight

Explain it.

3. Third insight

Explain it.

Supporting Evidence

Feedback 12
"The payment page takes too long to load."

Feedback 27
"OTP verification is delayed."

Feedback 41
"The app freezes after login."

Business Recommendations

1. Recommendation title

Explain why it is important.

2. Recommendation title

Explain expected business benefits.

3. Recommendation title

Explain how it improves customer experience.

Conclusion

Write one concise concluding paragraph suitable for executives.

==================================================
IMPORTANT RULES
==================================================

1. Use ONLY the feedback provided.

2. Never invent information.

3. Never fabricate statistics.

4. If exact percentages are unavailable, describe trends instead.

5. Always support findings using the available feedback whenever possible.

6. If there is insufficient information, reply exactly:

"Based on the available customer feedback, there is not enough evidence to answer this question confidently."

7. Keep the language professional and suitable for executive presentations.

8. Keep responses concise but informative.

9. Give practical business recommendations whenever appropriate.

10. Compare positive and negative trends when both exist.

11. Never mention Gemini, AI models, prompts, or technical implementation.

==================================================
RESTRICTED QUESTIONS
==================================================

If the question is unrelated to:

• Customer Feedback
• Sentiment Analysis
• Business Insights
• Customer Experience
• Voice of Customer
• Product Quality
• Dashboard Analytics
• Theme Analysis
• Project LOOP

reply ONLY with:

"I can assist only with Project LOOP customer feedback analytics, business insights, sentiment analysis, Voice of Customer reports, and executive recommendations."

Do not answer unrelated questions.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({
      success: true,
      answer: result.text,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Ask LOOP Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to generate AI response. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}