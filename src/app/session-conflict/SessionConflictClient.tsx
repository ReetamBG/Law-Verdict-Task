"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { forceLogoutSession } from "@/actions/user.actions";
import { Laptop, Smartphone, Monitor, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface SessionConflictClientProps {
  activeSessions: string[];
  currentSessionId: string;
  auth0Id: string;
}

const SessionConflictClient = ({
  activeSessions,
  currentSessionId,
  auth0Id,
}: SessionConflictClientProps) => {
  const router = useRouter();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDeviceIcon = (index: number) => {
    const icons = [Monitor, Laptop, Smartphone];
    const Icon = icons[index % icons.length];
    return <Icon className="h-5 w-5 2xl:h-6 2xl:w-6" />;
  };

  const handleForceLogout = async () => {
    if (!selectedSession) return;

    setIsLoading(true);
    try {
      const result = await forceLogoutSession(
        auth0Id,
        selectedSession,
        currentSessionId
      );

      if (result.status) {
        // Success - redirect to dashboard
        router.push("/dashboard");
        router.refresh();
      } else {
        console.error("Failed to force logout:", result.message);
        alert("Failed to logout the selected device. Please try again.");
      }
    } catch (error) {
      console.error("Error during force logout:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 2xl:w-20 2xl:h-20 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 2xl:h-10 2xl:w-10 text-orange-600 dark:text-orange-500" />
          </div>
          <CardTitle className="text-2xl 2xl:text-3xl">
            Maximum Active Sessions Reached
          </CardTitle>
          <CardDescription className="text-base 2xl:text-lg">
            You have reached the maximum of 3 active sessions. Please select a
            device to log out from to continue.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm 2xl:text-base font-medium">
              Active Sessions ({activeSessions.length}/3):
            </p>
            <div className="space-y-2">
              {activeSessions.map((session, index) => (
                <Card
                  key={session}
                  className={`cursor-pointer transition-all hover:border-primary ${
                    selectedSession === session
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => setSelectedSession(session)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(index)}
                      <div>
                        <p className="font-medium text-sm 2xl:text-base">
                          Device {index + 1}
                        </p>
                        <p className="text-xs 2xl:text-sm text-muted-foreground">
                          Session ID: {session.substring(0, 12)}...
                        </p>
                      </div>
                    </div>
                    {selectedSession === session && (
                      <Badge variant="default">Selected</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-4">
            <p className="text-xs 2xl:text-sm text-blue-900 dark:text-blue-100">
              <strong>Note:</strong> The selected device will be logged out
              immediately. You&apos;ll be logged in on this device instead.
            </p>
          </div>

          <Button
            onClick={handleForceLogout}
            disabled={!selectedSession || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 2xl:h-5 2xl:w-5 animate-spin" />
                Logging Out...
              </>
            ) : (
              "Force Logout & Continue"
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default SessionConflictClient;
