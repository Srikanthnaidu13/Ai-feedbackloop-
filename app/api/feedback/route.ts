import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { analyzeFeedback } from "@/lib/ai";
import { notifyAll } from "@/lib/events";


// ======================
// GET RECENT FEEDBACK
// ======================

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("GET Feedback Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch feedback",
      },
      {
        status: 500,
      }
    );
  }
}


// ======================
// CREATE FEEDBACK
// ======================

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      content,
      channel,
      userId,
    } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        {
          error: "Content is required",
        },
        {
          status: 400,
        }
      );
    }

    // AI Classification
    const {
      sentiment,
      theme,
    } = analyzeFeedback(content);

    const feedback = await prisma.feedback.create({
      data: {
        content,

        channel: channel || "web",

        sentiment,
        theme,

        userId: userId || null,
      },
    });

    // Notify all connected SSE clients
    notifyAll();

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Feedback API Error:", error);

    return NextResponse.json(
      {
        error: "Failed to save feedback",
      },
      {
        status: 500,
      }
    );
  }
}