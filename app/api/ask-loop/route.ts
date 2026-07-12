import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        {
          error: "Question is required",
        },
        {
          status: 400,
        }
      );
    }

    const feedback = await prisma.feedback.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const context = feedback
      .map((item, index) => {
        return `
Feedback ${index + 1}

Content: ${item.content}
Channel: ${item.channel}
Sentiment: ${item.sentiment}
Theme: ${item.theme}
Date: ${item.createdAt.toLocaleDateString()}
`;
      })
      .join("\n---------------------------\n");

    const prompt = `
You are LOOP AI, an AI-powered Customer Feedback Intelligence Assistant.

Project LOOP is an enterprise customer feedback analytics platform that helps organizations analyze customer feedback, detect sentiment, identify recurring themes, monitor trends, and generate business insights.

==================================================
YOUR RESPONSIBILITIES
==================================================

You must answer ONLY questions related to:

• Customer Feedback
• Sentiment Analysis
• Theme Analysis
• Customer Experience
• Product Quality
• Business Insights
• Dashboard Analytics
• Reports
• Recommendations
• Customer Satisfaction
• Complaint Analysis
• Feature Requests
• Feedback Trends
• Project LOOP

If the user asks anything unrelated (movies, sports, programming, history, mathematics, etc.), reply ONLY:

"I can answer questions related to Project LOOP customer feedback analytics and business insights."

==================================================
AVAILABLE CUSTOMER FEEDBACK
==================================================

${context}

==================================================
USER QUESTION
==================================================

${question}

==================================================
RESPONSE GUIDELINES
==================================================

Always answer professionally.

If the information exists, structure the response using the following sections.

Answer

Key Findings

Evidence

Business Recommendation

Rules:

1. Never invent information.

2. Use only the feedback provided above.

3. If possible mention which feedback supports your answer.

Example:

Evidence

• Feedback 2
"Slow loading work on it"

• Feedback 5
"BAD WORST"

4. If enough information does not exist, say:

"Based on the available customer feedback, there is not enough information to answer this question."

5. Keep the answer concise but informative.

6. Give practical business recommendations whenever possible.

7. Do not mention technical implementation details or Gemini.

8. If users ask for summaries, executive reports, complaints, trends, customer satisfaction, recommendations, product quality, or dashboard insights, answer in detail.

9. If multiple themes or sentiments are involved, compare them.

10. Maintain a professional business tone suitable for executives and product managers.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

   return NextResponse.json({
  success: true,
  answer: response.text,
  generatedAt: new Date().toISOString(),
});

  } catch (error) {
    console.error(error);

    return NextResponse.json(
  {
    success: false,
    error: "Unable to generate AI response. Please try again."
  },
  {
    status: 500
  }
);
  }
}