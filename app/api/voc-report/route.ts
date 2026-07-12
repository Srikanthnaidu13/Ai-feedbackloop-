import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const feedback = await prisma.feedback.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = feedback.length;

    const positive = feedback.filter(
      (f) => f.sentiment === "POSITIVE"
    ).length;

    const negative = feedback.filter(
      (f) => f.sentiment === "NEGATIVE"
    ).length;

    const neutral = feedback.filter(
      (f) => f.sentiment === "NEUTRAL"
    ).length;

    const pending = feedback.filter(
      (f) => f.sentiment === "PENDING"
    ).length;

    // Theme Counts
    const themeCounts: Record<string, number> = {};

    feedback.forEach((item) => {
      if (!item.theme) return;

      themeCounts[item.theme] =
        (themeCounts[item.theme] || 0) + 1;
    });

    const sortedThemes = Object.entries(themeCounts).sort(
      (a, b) => b[1] - a[1]
    );

    const topTheme =
      sortedThemes.length > 0
        ? sortedThemes[0][0]
        : "No dominant theme";

    // Top complaints
    const complaints = feedback
      .filter((f) => f.sentiment === "NEGATIVE")
      .slice(0, 5)
      .map((f) => `• ${f.content}`)
      .join("\n");

    // Positive highlights
    const positives = feedback
      .filter((f) => f.sentiment === "POSITIVE")
      .slice(0, 5)
      .map((f) => `• ${f.content}`)
      .join("\n");

    const report = `
VOICE OF CUSTOMER REPORT



EXECUTIVE SUMMARY

Total Feedback Received : ${total}

Positive Feedback : ${positive}

Negative Feedback : ${negative}

Neutral Feedback : ${neutral}

Pending Analysis : ${pending}

Overall customer sentiment ${
      positive >= negative
        ? "is generally positive."
        : "requires improvement."
    }



CUSTOMER SENTIMENT

Positive : ${positive}

Negative : ${negative}

Neutral : ${neutral}

Pending : ${pending}



TOP CUSTOMER ISSUES

${
  complaints || "No major complaints identified."
}

POSITIVE HIGHLIGHTS

${
  positives || "No positive feedback available."
}


TRENDING THEMES

${sortedThemes
  .map(([theme, count]) => `• ${theme} (${count})`)
  .join("\n")}


BUSINESS INSIGHTS

• Most discussed theme: ${topTheme}

• ${
      negative > positive
        ? "Customer dissatisfaction is increasing."
        : "Customer experience remains healthy."
    }

• ${
      pending > 0
        ? `${pending} feedback entries still require AI classification.`
        : "All feedback has been analyzed."
    }


RECOMMENDATIONS

1. Investigate recurring negative feedback.

2. Improve product quality in frequently mentioned themes.

3. Continue monitoring customer sentiment daily.

4. Prioritize customer complaints from high-volume channels.

5. Track theme trends to identify emerging issues early.

END OF REPORT
`;

    return NextResponse.json({
      report,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to generate report",
      },
      {
        status: 500,
      }
    );
  }
}