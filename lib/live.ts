const clients = new Set<ReadableStreamDefaultController>();

export function addClient(
  controller: ReadableStreamDefaultController
) {
  clients.add(controller);
}

export function removeClient(
  controller: ReadableStreamDefaultController
) {
  clients.delete(controller);
}

export function notifyAll() {
  for (const client of clients) {
    try {
      client.enqueue(
        `data: ${JSON.stringify({
          timestamp: Date.now(),
        })}\n\n`
      );
    } catch {
      clients.delete(client);
    }
  }
}