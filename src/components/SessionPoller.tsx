"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface SessionPollerProps {
  auth0Id: string;
  currentSessionId: string;
}

export default function SessionPoller({
  auth0Id,
  currentSessionId,
}: SessionPollerProps) {
  const router = useRouter();
  const isCheckingRef = useRef(false);

  useEffect(() => {
    // Check session validity every 10 seconds
    const interval = setInterval(async () => {
      if (isCheckingRef.current) return;
      
      isCheckingRef.current = true;
      
      try {
        const response = await fetch("/api/check-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ auth0Id, currentSessionId }),
        });

        const data = await response.json();

        if (!data.isValid) {
          // Session is no longer valid, redirect to force-logout
          router.push("/force-logout");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        isCheckingRef.current = false;
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [auth0Id, currentSessionId, router]);

  return null; // This component doesn't render anything
}
