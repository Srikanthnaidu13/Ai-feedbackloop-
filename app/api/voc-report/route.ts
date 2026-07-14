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
Project LOOP

Voice of Customer Report

Generated on ${new Date().toLocaleString()}


Executive Summary

A total of ${total} customer feedback entries have been analyzed.

Overall customer sentiment is ${
  positive >= negative
    ? "predominantly positive, indicating that customers generally appreciate the product while highlighting several opportunities for improvement."
    : "mixed with recurring concerns that require immediate business attention."
}

The most frequently discussed area is "${topTheme}", making it the highest priority for future product improvements. This report summarizes customer sentiment, recurring themes, key customer concerns, positive highlights, business insights, and recommended actions.


Overall Sentiment

Positive Feedback : ${positive}

Negative Feedback : ${negative}

Neutral Feedback : ${neutral}

Pending Analysis : ${pending}


Trending Themes

${
  sortedThemes.length
    ? sortedThemes
        .map(([theme, count]) => `${theme} (${count})`)
        .join("\n")
    : "No themes available."
}


Key Customer Concerns

${
  complaints
    ? complaints.replace(/•/g, "")
    : "No significant customer concerns were identified."
}


Positive Highlights

${
  positives
    ? positives.replace(/•/g, "")
    : "No positive feedback is currently available."
}


Business Insights

The most frequently discussed customer theme is "${topTheme}".

${
  negative > positive
    ? "Negative feedback currently exceeds positive feedback, indicating several customer experience issues that should be prioritized."
    : "Positive feedback outweighs negative feedback, suggesting that customers generally have a favorable experience."
}

${
  pending > 0
    ? `${pending} feedback entries are still awaiting AI classification.`
    : "All customer feedback has been successfully analyzed."
}


Recommendations

Prioritize resolving the recurring issues reported by customers.

Focus engineering efforts on improving performance, reliability, and user experience within the highest discussed themes.

Continue monitoring customer sentiment regularly to detect emerging issues early.

Track long-term customer trends to support product roadmap decisions.

Use customer insights to guide future feature enhancements and quality improvements.


Conclusion

Customer feedback indicates ${
  positive >= negative
    ? "a generally positive perception of the product, supported by strong appreciation from many users."
    : "that customer satisfaction can be significantly improved by addressing recurring performance and usability concerns."
}

Continued analysis of customer feedback will help the organization improve customer satisfaction, strengthen product quality, and make better data-driven business decisions.
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