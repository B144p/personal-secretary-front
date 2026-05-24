"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiFetch, toastApiError } from "@/lib/api";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await apiFetch("/auth/google/logout", { method: "POST" });
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
