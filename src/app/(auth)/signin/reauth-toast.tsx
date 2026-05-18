"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function ReauthToast() {
  useEffect(() => {
    toast.error("Your Google access expired. Please sign in again.");
  }, []);
  return null;
}
