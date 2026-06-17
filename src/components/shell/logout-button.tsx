"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toastApiError } from "@/lib/api";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      // Clears the httpOnly jwt cookie on the frontend domain (server-side).
      const res = await fetch("/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      toastApiError(err);
      return;
    }
    router.push("/signin");
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      Sign out
    </Button>
  );
}
