import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const { id } = await req.json();

    const feedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    const prompt = `
Classify this customer feedback.

Return ONLY JSON.

{
"sentiment":"POSITIVE | NEGATIVE | NEUTRAL",
"theme":"one word"
}

Feedback:
${feedback.content}
`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    const json = JSON.parse(
      text.replace(/```json/g, "").replace(/```/g, "")
    );

    await prisma.feedback.update({
      where: { id },
      data: {
        sentiment: json.sentiment,
        theme: json.theme,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Reclassification failed" },
      { status: 500 }
    );
  }
}