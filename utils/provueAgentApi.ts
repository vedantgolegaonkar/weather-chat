const API_URL = "/api/chat";


type StreamCallback = (chunk: string) => void;

export async function streamProvueAgentResponse(
  prompt: string,
  onChunk: StreamCallback
) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error("Failed to connect to Provue agent");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Split by new lines (SSE format)
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data:")) continue;

      const jsonString = line.replace("data:", "").trim();
      if (!jsonString) continue;

      try {
        const event = JSON.parse(jsonString);

        // We only care about streaming text
        if (event.type === "text-delta") {
          onChunk(event.payload.text);
        }
      } catch {
        // Ignore malformed chunks
      }
    }
  }
}
