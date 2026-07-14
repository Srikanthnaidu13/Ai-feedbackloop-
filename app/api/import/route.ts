import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { notifyAll } from "@/lib/events";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const rows = body.rows;

    if (!rows || !Array.isArray(rows)) {
      return NextResponse.json(
        {
          error: "Invalid CSV data.",
        },
        {
          status: 400,
        }
      );
    }

    let imported = 0;
    let skipped = 0;

    for (const row of rows) {
      const content = row.content?.trim();
      const channel = row.channel?.trim();

      if (!content || !channel) {
        skipped++;
        continue;
      }

      try {
        await prisma.feedback.create({
          data: {
            content,
            channel,
            sentiment: "Pending",
            theme: "Uncategorized",
          },
        });

        imported++;
      } catch (error) {
        skipped++;
      }
    }

    // Notify Dashboard, Feedback and Insights pages
notifyAll();

return NextResponse.json({
  total: rows.length,
  imported,
  skipped,
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Import failed.",
      },
      {
        status: 500,
      }
    );
  }
}