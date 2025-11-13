"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Laptop, Monitor, Smartphone } from "lucide-react";

interface ActiveSessionsCardProps {
  sessions: string[];
  currentSessionId: string;
}

const ActiveSessionsCard = ({
  sessions,
  currentSessionId,
}: ActiveSessionsCardProps) => {
  const getDeviceIcon = (index: number) => {
    const icons = [Monitor, Laptop, Smartphone];
    const Icon = icons[index % icons.length];
    return <Icon className="h-5 w-5 2xl:h-6 2xl:w-6 text-primary" />;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl 2xl:text-2xl">Active Sessions</CardTitle>
        <CardDescription className="text-sm 2xl:text-base">
          You are currently logged in on {sessions.length} device
          {sessions.length !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessions.map((session, index) => {
            const isCurrentSession = session === currentSessionId;
            return (
              <div
                key={session}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isCurrentSession
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  {getDeviceIcon(index)}
                  <div>
                    <p className="font-medium text-sm 2xl:text-base">
                      Device {index + 1}
                      {isCurrentSession && " (This device)"}
                    </p>
                    <p className="text-xs 2xl:text-sm text-muted-foreground">
                      Session: {session.substring(0, 16)}...
                    </p>
                  </div>
                </div>
                {isCurrentSession && (
                  <Badge variant="default" className="text-xs 2xl:text-sm">
                    Current
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-3">
          <p className="text-xs 2xl:text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> You can have up to 3 active sessions. When you
            log in from a 4th device, you&apos;ll need to select a device to log out
            from.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveSessionsCard;
