import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const feedbackPool = [
  {
    content: "The checkout process is confusing.",
    channel: "Website",
  },
  {
    content: "Love the new dashboard UI.",
    channel: "Website",
  },
  {
    content: "App crashes whenever I upload an image.",
    channel: "Play Store",
  },
  {
    content: "Customer support responded very quickly.",
    channel: "Email",
  },
  {
    content: "The payment page takes too long to load.",
    channel: "Website",
  },
  {
    content: "Dark mode looks amazing.",
    channel: "Twitter",
  },
  {
    content: "OTP verification is delayed.",
    channel: "Email",
  },
  {
    content: "Navigation is difficult on mobile.",
    channel: "Play Store",
  },
  {
    content: "Search feature is very accurate.",
    channel: "Website",
  },
  {
    content: "Notifications arrive too late.",
    channel: "Instagram",
  },
  {
    content: "Excellent customer experience.",
    channel: "Facebook",
  },
  {
    content: "The app freezes after login.",
    channel: "Play Store",
  },
];

const sentiments = [
  "POSITIVE",
  "NEUTRAL",
  "NEGATIVE",
];

const themes = [
  "Authentication",
  "Payments",
  "Performance",
  "User Interface",
  "Notifications",
  "Search",
  "Support",
  "Dashboard",
];

function randomFeedback() {
  return feedbackPool[
    Math.floor(Math.random() * feedbackPool.length)
  ];
}

function randomSentiment() {
  return sentiments[
    Math.floor(Math.random() * sentiments.length)
  ];
}

function randomTheme() {
  return themes[
    Math.floor(Math.random() * themes.length)
  ];
}

function randomDate() {
  const date = new Date();

  const daysAgo = Math.floor(Math.random() * 90);

  date.setDate(date.getDate() - daysAgo);

  return date;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const count = body.count ?? 50;

    const records = [];

    for (let i = 0; i < count; i++) {
      const feedback = randomFeedback();

      records.push({
        content: feedback.content,
        channel: feedback.channel,
        sentiment: randomSentiment(),
        theme: randomTheme(),
        createdAt: randomDate(),
      });
    }

    await prisma.feedback.createMany({
      data: records,
    });

    return NextResponse.json({
      success: true,
      imported: records.length,
      message: `${records.length} demo feedback records created successfully.`,
    });
  } catch (error) {
    console.error("Seed Feedback Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to generate demo feedback.",
      },
      {
        status: 500,
      }
    );
  }
}