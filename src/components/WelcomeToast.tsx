"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function WelcomeToast({ userName }: { userName?: string }) {
  const hasShown = useRef(false);

  useEffect(() => {
    if (hasShown.current) return;
    
    if (userName) {
      toast.success(`Welcome back, ${userName}!`);
    } else {
      toast.success("Welcome! Please complete your profile");
    }
    
    hasShown.current = true;
  }, [userName]);

  return null;
}
