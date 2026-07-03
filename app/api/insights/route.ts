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

    const sentimentCounts = {
      positive: feedbacks.filter(
        (f) => f.sentiment === "POSITIVE"
      ).length,

      negative: feedbacks.filter(
        (f) => f.sentiment === "NEGATIVE"
      ).length,

      neutral: feedbacks.filter(
        (f) => f.sentiment === "NEUTRAL"
      ).length,

      pending: feedbacks.filter(
        (f) => f.sentiment === "PENDING"
      ).length,
    };

    const themeCounts: Record<string, number> = {};

    feedbacks.forEach((feedback) => {
      const theme = feedback.theme || "General";

      themeCounts[theme] =
        (themeCounts[theme] || 0) + 1;
    });

    const topTheme =
      Object.entries(themeCounts).sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0] || "None";

    const dominantSentiment =
      Object.entries(sentimentCounts).sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0] || "neutral";

    const insights: string[] = [];

    if (dominantSentiment === "positive") {
      insights.push(
        "Overall customer sentiment is highly positive."
      );
    }

    if (dominantSentiment === "negative") {
      insights.push(
        "Negative sentiment is dominant and requires immediate review."
      );
    }

    if (sentimentCounts.pending > 0) {
      insights.push(
        `${sentimentCounts.pending} feedback items still require processing.`
      );
    }

    if (topTheme !== "None") {
      insights.push(
        `Most discussions revolve around '${topTheme}'.`
      );
    }

    const aiSummary = `
Analyzed ${totalFeedback} customer feedback entries.
The dominant sentiment is ${dominantSentiment}.
The most discussed topic is ${topTheme}.
${
  sentimentCounts.negative > sentimentCounts.positive
    ? "Customer satisfaction requires immediate attention."
    : "Overall customer satisfaction appears healthy."
}
`;

return NextResponse.json({
  totalFeedback,
  sentimentCounts,
  themeCounts,

  aiSummary,
  topTheme,
  dominantSentiment,
  insights,

  recentFeedback: feedbacks.slice(0, 5),
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