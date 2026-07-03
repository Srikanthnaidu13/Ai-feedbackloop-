import { subscribe } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Initial connection
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "connected",
          })}\n\n`
        )
      );

      // Keep connection alive
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "ping",
                timestamp: Date.now(),
              })}\n\n`
            )
          );
        } catch {
          clearInterval(pingInterval);
        }
      }, 30000);

      // Subscribe to application events
      const unsubscribe = subscribe(() => {
        try {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "update",
                timestamp: Date.now(),
              })}\n\n`
            )
          );
        } catch (error) {
          console.error("SSE Error:", error);
        }
      });

      return () => {
        clearInterval(pingInterval);
        unsubscribe();
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}