import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const feedback = await prisma.feedback.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    const now = new Date();

    // Current Period = Last 7 Days
    const currentStart = new Date(now);
    currentStart.setDate(now.getDate() - 7);

    // Previous Period = 7 Days Before That
    const previousStart = new Date(now);
    previousStart.setDate(now.getDate() - 14);

    const current: Record<string, number> = {};
    const previous: Record<string, number> = {};

    feedback.forEach((item) => {
      if (!item.theme) return;

      const created = new Date(item.createdAt);

      // Current 7 days
      if (created >= currentStart) {
        current[item.theme] = (current[item.theme] || 0) + 1;
      }

      // Previous 7 days
      else if (created >= previousStart && created < currentStart) {
        previous[item.theme] = (previous[item.theme] || 0) + 1;
      }
    });

    const allThemes = new Set([
      ...Object.keys(current),
      ...Object.keys(previous),
    ]);

    const spikes = Array.from(allThemes)
      .map((theme) => {
        const currentCount = current[theme] || 0;
        const previousCount = previous[theme] || 0;

        let increase = 0;

        if (previousCount === 0) {
          if (currentCount >= 3) {
            increase = 100;
          }
        } else {
          increase =
            ((currentCount - previousCount) / previousCount) * 100;
        }

        return {
          theme,
          current: currentCount,
          previous: previousCount,
          increase: Math.round(increase),
        };
      })
      .filter(
        (item) =>
          item.current > 0 &&
          (item.increase >= 20 || item.previous > 0)
      )
      .sort((a, b) => b.increase - a.increase);

    return NextResponse.json(spikes);
  } catch (error) {
    console.error("Spike Detection Error:", error);

    return NextResponse.json(
      {
        error: "Failed to detect spikes",
      },
      {
        status: 500,
      }
    );
  }
}