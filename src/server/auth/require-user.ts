import "server-only";

import { redirect } from "next/navigation";
import { auth } from "~/server/auth/config";

export async function requireUser(returnTo: string) {
  const session = await auth();

  if (!session?.user.id) {
    const query = new URLSearchParams({ callbackUrl: returnTo }).toString();
    redirect(`/auth/login?${query}`);
  }

  return session.user;
}
