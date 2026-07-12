import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Feedback } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const page =
      Number(req.nextUrl.searchParams.get("page")) || 1;

    const limit =
      Number(req.nextUrl.searchParams.get("limit")) || 5;

    const skip = (page - 1) * limit;

    // Total count
    const totalFeedback =
      await prisma.feedback.count();

    // Current page
    const feedbacks: Feedback[] =
      await prisma.feedback.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });

    // All feedback (only for dashboard statistics)
    const allFeedback =
      await prisma.feedback.findMany({
        select: {
          sentiment: true,
          theme: true,
        },
      });

    const pendingCount =
      allFeedback.filter(
        f => f.sentiment === "PENDING"
      ).length;

    const activeThemes =
      new Set(
        allFeedback
          .map(f => f.theme)
          .filter(Boolean)
      ).size;

    const sentimentCounts = {
      positive:
        allFeedback.filter(
          f => f.sentiment === "POSITIVE"
        ).length,

      negative:
        allFeedback.filter(
          f => f.sentiment === "NEGATIVE"
        ).length,

      neutral:
        allFeedback.filter(
          f => f.sentiment === "NEUTRAL"
        ).length,

      pending:
        allFeedback.filter(
          f => f.sentiment === "PENDING"
        ).length,
    };

    const themeCounts: Record<string, number> = {};

    allFeedback.forEach(f => {
      if (!f.theme) return;

      themeCounts[f.theme] =
        (themeCounts[f.theme] || 0) + 1;
    });

    return NextResponse.json({
      totalFeedback,
      pendingCount,
      activeThemes,
      sentimentCounts,
      themeCounts,

      recentFeedback: feedbacks,

      page,
      limit,
      totalPages: Math.ceil(totalFeedback / limit),
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Dashboard API Error",
      },
      {
        status: 500,
      }
    );
  }
}