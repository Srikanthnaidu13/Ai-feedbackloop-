export function analyzeFeedback(content: string) {
  const text = content.toLowerCase();

  // --------------------
  // Sentiment Analysis
  // --------------------
  let sentiment = "NEUTRAL";

  const positiveWords = [
    "good",
    "great",
    "excellent",
    "love",
    "awesome",
    "amazing",
    "fast",
    "easy",
    "happy",
    "satisfied",
  ];

  const negativeWords = [
    "bad",
    "terrible",
    "hate",
    "slow",
    "broken",
    "issue",
    "problem",
    "bug",
    "worst",
    "difficult",
    "error",
    "crash",
  ];

  if (
  positiveWords.some((word) => text.includes(word))
) {
  sentiment = "POSITIVE";
} else if (
  negativeWords.some((word) => text.includes(word))
) {
  sentiment = "NEGATIVE";
}

  // --------------------
  // Theme Detection
  // --------------------
  let theme = "General";

  if (
    text.includes("login") ||
    text.includes("password") ||
    text.includes("signup")
  ) {
    theme = "Authentication";
  } else if (
    text.includes("payment") ||
    text.includes("billing") ||
    text.includes("price")
  ) {
    theme = "Billing";
  } else if (
    text.includes("dashboard") ||
    text.includes("analytics")
  ) {
    theme = "Dashboard";
  } else if (
    text.includes("ui") ||
    text.includes("design") ||
    text.includes("layout")
  ) {
    theme = "User Interface";
  } else if (
    text.includes("support") ||
    text.includes("help")
  ) {
    theme = "Customer Support";
  }

  return {
    sentiment,
    theme,
  };
}