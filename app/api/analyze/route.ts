import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { content } = await req.json();

  // 🔥 SIMPLE MOCK AI (replace with OpenAI later)
  const lower = content.toLowerCase();

  let sentiment = "NEUTRAL";
  let theme = "General";

  if (lower.includes("bad") || lower.includes("worst")) {
    sentiment = "NEGATIVE";
  } else if (lower.includes("good") || lower.includes("great")) {
    sentiment = "POSITIVE";
  }

  if (lower.includes("dashboard")) theme = "UI";
  if (lower.includes("payment")) theme = "Billing";

  return NextResponse.json({
    sentiment,
    theme,
    summary: `AI detected ${sentiment.toLowerCase()} sentiment with focus on ${theme}.`,
  });
}