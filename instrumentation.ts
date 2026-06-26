// Server-side error monitoring (Sentry). No-op and zero bundle cost unless SENTRY_DSN is set.
// Full source-map upload needs withSentryConfig + an auth token — see README.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.SENTRY_DSN) {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.1 });
  }
}

export async function onRequestError(error: unknown, request: unknown, context: unknown) {
  if (!process.env.SENTRY_DSN) return;
  const Sentry = await import("@sentry/nextjs");
  (Sentry.captureRequestError as (e: unknown, r: unknown, c: unknown) => void)(error, request, context);
}
