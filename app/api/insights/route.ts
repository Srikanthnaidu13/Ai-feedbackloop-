import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalFeedback = feedbacks.length;

    // Correct sentiment counting
    const sentimentCounts = {
      positive: 0,
      negative: 0,
      neutral: 0,
      pending: 0,
    };

    feedbacks.forEach((feedback) => {
      const sentiment = (feedback.sentiment || "PENDING")
        .trim()
        .toUpperCase();

      switch (sentiment) {
        case "POSITIVE":
          sentimentCounts.positive++;
          break;

        case "NEGATIVE":
          sentimentCounts.negative++;
          break;

        case "NEUTRAL":
          sentimentCounts.neutral++;
          break;

        default:
          sentimentCounts.pending++;
          break;
      }
    });

    // Theme counts
    const themeCounts: Record<string, number> = {};

    feedbacks.forEach((feedback) => {
      const theme = feedback.theme || "General";

      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });

    const sortedThemes = Object.entries(themeCounts).sort(
      (a, b) => b[1] - a[1]
    );

    const topTheme =
      sortedThemes.length > 0 ? sortedThemes[0][0] : "None";

    const dominantSentiment =
      Object.entries(sentimentCounts).sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0] || "neutral";

    const insights: string[] = [];

    if (dominantSentiment === "positive") {
      insights.push(
        "Overall customer sentiment is predominantly positive."
      );
    }

    if (dominantSentiment === "negative") {
      insights.push(
        "Negative sentiment is dominant and should be addressed immediately."
      );
    }

    if (sentimentCounts.pending > 0) {
      insights.push(
        `${sentimentCounts.pending} feedback item(s) are awaiting AI classification.`
      );
    }

    if (topTheme !== "None") {
      insights.push(
        `The most frequently discussed customer theme is "${topTheme}".`
      );
    }

    const aiSummary = `
Project LOOP analyzed ${totalFeedback} customer feedback entries.

Dominant Sentiment: ${dominantSentiment}

Most Discussed Theme: ${topTheme}

${
  sentimentCounts.negative > sentimentCounts.positive
    ? "Customer satisfaction requires immediate attention due to the higher volume of negative feedback."
    : "Overall customer satisfaction appears healthy based on the current feedback."
}
`.trim();

    return NextResponse.json({
      totalFeedback,
      sentimentCounts,
      themeCounts,
      aiSummary,
      topTheme,
      dominantSentiment,
      insights,

      // Latest feedback
      recentFeedback: feedbacks.slice(0, 10),
    });
  } catch (error) {
    console.error("Insights API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch insights",
      },
      {
        status: 500,
      }
    );
  }
}