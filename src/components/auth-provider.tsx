"use client";

import { useEffect, useRef } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { getLoginRedirectUrl } from "~/utils/login-redirect";

function SessionIdentitySync() {
  const { data: session, status } = useSession();
  const initialIdentity = useRef<string | null | undefined>(undefined);
  const reloading = useRef(false);
  const userId = session?.user.id ?? null;

  useEffect(() => {
    if (status === "loading" || reloading.current) return;

    // signIn updates client session state before its promise resolves. Use the
    // same destination as the form instead of racing it with a login-page reload.
    if (
      userId &&
      window.location.pathname.replace(/\/$/, "") === "/auth/login"
    ) {
      reloading.current = true;
      window.location.replace(getLoginRedirectUrl(window.location.href));
      return;
    }

    // The first client session resolves identity for static pages; it is not an
    // account change. Only subsequent changes should discard personalized state.
    if (initialIdentity.current === undefined) {
      initialIdentity.current = userId;
    } else if (userId !== initialIdentity.current) {
      reloading.current = true;
      // Refresh server-rendered identity and discard the previous user's query cache.
      window.location.reload();
    }
  }, [status, userId]);

  return null;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchOnWindowFocus refetchInterval={0}>
      <SessionIdentitySync />
      {children}
    </SessionProvider>
  );
}
