// Replit injects the Umami tracker only in published builds with analytics enabled.
// Analytics must remain optional so it never affects the user experience.
export function trackEvent(name, data) {
  if (typeof window === 'undefined') return;

  try {
    window.umami?.track(name, data);
  } catch {
    // Analytics failures must never break the application.
  }
}