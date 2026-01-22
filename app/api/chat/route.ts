import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const upstreamResponse = await fetch(
    "https://api-dev.provue.ai/api/webapp/agent/test-agent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify({
        prompt,
        stream: true,
      }),
    }
  );

  if (!upstreamResponse.body) {
    return new NextResponse("No response body", { status: 500 });
  }

  return new NextResponse(upstreamResponse.body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
