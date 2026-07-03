import { prisma } from "@/lib/prisma";
import type { Feedback } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const feedbacks: Feedback[] =
      await prisma.feedback.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    const totalFeedback = feedbacks.length;

    const pendingCount = feedbacks.filter(
      (feedback: Feedback) =>
        feedback.sentiment === "PENDING"
    ).length;

    const activeThemes = new Set(
      feedbacks
        .map((feedback: Feedback) => feedback.theme)
        .filter(Boolean)
    ).size;

    const sentimentCounts = {
      positive: feedbacks.filter(
        (f: Feedback) => f.sentiment === "POSITIVE"
      ).length,

      negative: feedbacks.filter(
        (f: Feedback) => f.sentiment === "NEGATIVE"
      ).length,

      neutral: feedbacks.filter(
        (f: Feedback) => f.sentiment === "NEUTRAL"
      ).length,

      pending: feedbacks.filter(
        (f: Feedback) => f.sentiment === "PENDING"
      ).length,
    };

    const themeCounts: Record<string, number> = {};

    feedbacks.forEach((feedback: Feedback) => {
      if (!feedback.theme) return;

      themeCounts[feedback.theme] =
        (themeCounts[feedback.theme] || 0) + 1;
    });

    return NextResponse.json({
      totalFeedback,
      pendingCount,
      activeThemes,
      sentimentCounts,
      themeCounts,
      recentFeedback: feedbacks.slice(0, 5),
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch dashboard data",
      },
      {
        status: 500,
      }
    );
  }
}