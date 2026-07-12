import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const feedback = await prisma.feedback.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  const grouped: Record<string, Record<string, number>> = {};

  feedback.forEach((item) => {
    if (!item.theme) return;

    const day = item.createdAt.toISOString().split("T")[0];

    if (!grouped[day]) {
      grouped[day] = {};
    }

    grouped[day][item.theme] =
      (grouped[day][item.theme] || 0) + 1;
  });

  const trends = Object.entries(grouped).map(
    ([date, themes]) => ({
      date,
      ...themes,
    })
  );

  return NextResponse.json(trends);
}