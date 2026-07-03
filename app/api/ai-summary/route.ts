import { NextResponse } from "next/server";

export async function POST() {
  console.log("TEST DEPLOY WORKING");

  return NextResponse.json({
    summary: "THIS IS A TEST RESPONSE",
  });
}