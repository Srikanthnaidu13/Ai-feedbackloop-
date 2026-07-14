import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const feedback = await prisma.feedback.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  const grouped: Record<
    string,
    Record<string, number>
  > = {};

  feedback.forEach((item) => {
    if (!item.theme) return;

    const month = item.createdAt.toLocaleString("en-US", {
      month: "short",
    });

    if (!grouped[month]) {
      grouped[month] = {};
    }

    grouped[month][item.theme] =
      (grouped[month][item.theme] || 0) + 1;
  });

  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const trends = monthOrder
    .filter((month) => grouped[month])
    .map((month) => ({
      date: month,
      ...grouped[month],
    }));

  return NextResponse.json(trends);
}