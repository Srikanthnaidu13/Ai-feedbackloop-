import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return Response.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const headers = [
      "ID",
      "Content",
      "Channel",
      "Sentiment",
      "Theme",
      "Created At",
    ];

    const rows = feedbacks.map((f) => [
      f.id,
      `"${f.content.replace(/"/g, '""')}"`,
      f.channel ?? "",
      f.sentiment ?? "",
      f.theme ?? "",
      f.createdAt.toISOString(),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          'attachment; filename="feedback-export.csv"',
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Export failed" },
      { status: 500 }
    );
  }
}