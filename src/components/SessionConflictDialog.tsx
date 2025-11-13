"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { forceLogoutSession } from "@/actions/user.actions";
import { Laptop, Smartphone, Monitor, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface SessionConflictDialogProps {
  open: boolean;
  onClose: () => void;
  activeSessions: string[];
  currentSessionId: string;
  auth0Id: string;
}

const SessionConflictDialog = ({
  open,
  onClose,
  activeSessions,
  currentSessionId,
  auth0Id,
}: SessionConflictDialogProps) => {
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
        // Success - refresh the page to update session state
        router.refresh();
        onClose();
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

  const handleCancelLogin = () => {
    // Redirect to logout to cancel current login attempt
    window.location.href = "/auth/logout";
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[525px] 2xl:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="text-xl 2xl:text-2xl">
            Maximum Active Sessions Reached
          </DialogTitle>
          <DialogDescription className="text-sm 2xl:text-base">
            You&apos;ve reached the maximum of 3 active sessions. Please select a
            device to log out from, or cancel this login.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
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
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleCancelLogin}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel Login
          </Button>
          <Button
            onClick={handleForceLogout}
            disabled={!selectedSession || isLoading}
            className="w-full sm:w-auto"
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionConflictDialog;
