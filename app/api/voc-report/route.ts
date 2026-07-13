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

    const complaints = feedback
      .filter((f) => f.sentiment === "NEGATIVE")
      .slice(0, 5)
      .map((f) => `• ${f.content}`)
      .join("\n");

    const positives = feedback
      .filter((f) => f.sentiment === "POSITIVE")
      .slice(0, 5)
      .map((f) => `• ${f.content}`)
      .join("\n");

    const report = `
==================================================
            PROJECT LOOP
     VOICE OF CUSTOMER (VoC) REPORT
==================================================

Generated On:
${new Date().toLocaleString()}

--------------------------------------------------
1. EXECUTIVE SUMMARY
--------------------------------------------------

Total Feedback Collected : ${total}

Overall customer sentiment is ${
      positive >= negative
        ? "largely positive with opportunities for continuous improvement."
        : "showing signs of dissatisfaction that require immediate attention."
    }

The most discussed customer theme is "${topTheme}". This report summarizes customer sentiment, recurring issues, positive highlights, and recommended business actions.

--------------------------------------------------
2. CUSTOMER SENTIMENT OVERVIEW
--------------------------------------------------

Positive Feedback : ${positive}

Negative Feedback : ${negative}

Neutral Feedback : ${neutral}

Pending Analysis : ${pending}

--------------------------------------------------
3. TRENDING THEMES
--------------------------------------------------

${
  sortedThemes.length
    ? sortedThemes
        .map(([theme, count]) => `• ${theme} (${count})`)
        .join("\n")
    : "No themes available."
}

--------------------------------------------------
4. KEY CUSTOMER CONCERNS
--------------------------------------------------

${
  complaints || "No major customer complaints identified."
}

--------------------------------------------------
5. POSITIVE HIGHLIGHTS
--------------------------------------------------

${
  positives || "No positive feedback available."
}

--------------------------------------------------
6. BUSINESS INSIGHTS
--------------------------------------------------

• Most discussed theme: ${topTheme}

• ${
      negative > positive
        ? "Negative sentiment exceeds positive feedback, indicating areas requiring improvement."
        : "Positive customer sentiment outweighs negative feedback."
    }

• ${
      pending > 0
        ? `${pending} feedback entries are still awaiting AI classification.`
        : "All feedback has been successfully analyzed."
    }

--------------------------------------------------
7. RECOMMENDATIONS
--------------------------------------------------

1. Prioritize resolution of recurring customer complaints.

2. Improve product quality in frequently mentioned themes.

3. Optimize website and application performance where necessary.

4. Continue monitoring customer sentiment daily.

5. Track theme trends to identify emerging issues early.

--------------------------------------------------
END OF REPORT
--------------------------------------------------
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