/**
 * Reliable Intercom launcher — waits for the widget to be fully loaded
 * before calling show(). Works on mobile and desktop.
 */
export function openIntercom() {
  if (typeof window === "undefined") return;

  const w = window as any;

  // If Intercom is fully loaded (real function, not just the queue stub)
  if (typeof w.Intercom === "function" && !w.Intercom.q) {
    w.Intercom("update", w.intercomSettings);
    w.Intercom("show");
    return;
  }

  // Intercom exists as queue stub or is loading — poll until widget is ready
  let attempts = 0;
  const maxAttempts = 30; // 30 × 200ms = 6s max wait
  const interval = setInterval(() => {
    attempts++;
    const ic = w.Intercom;
    if (typeof ic === "function" && !ic.q) {
      clearInterval(interval);
      ic("update", w.intercomSettings);
      ic("show");
    } else if (attempts >= maxAttempts) {
      clearInterval(interval);
      // Last resort: try anyway (queue might still process it)
      if (typeof ic === "function") {
        ic("update", w.intercomSettings);
        ic("show");
      }
    }
  }, 200);
}
