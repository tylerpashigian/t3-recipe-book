export function getLoginRedirectUrl(loginUrl: string): string {
  const current = new URL(loginUrl);
  const fallback = new URL("/", current.origin).href;

  try {
    const destination = new URL(
      current.searchParams.get("callbackUrl") ?? "/",
      current.origin,
    );
    return destination.origin === current.origin &&
      destination.pathname.replace(/\/$/, "") !== "/auth/login"
      ? destination.href
      : fallback;
  } catch {
    return fallback;
  }
}
