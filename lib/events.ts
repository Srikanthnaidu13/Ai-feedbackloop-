type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribe(listener: Listener) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

export function notifyAll() {
  listeners.forEach((listener) => listener());
}