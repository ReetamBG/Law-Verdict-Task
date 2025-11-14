"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForceLogoutPage() {
  const router = useRouter();

  const handleLoginAgain = () => {
    // Redirect to session conflict page which will handle the login flow
    router.push("/session-conflict");
  };

  const handleCancel = () => {
    // Logout the user
    window.location.href = "/auth/logout";
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 2xl:w-20 2xl:h-20 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 2xl:h-10 2xl:w-10 text-orange-600 dark:text-orange-500" />
          </div>
          <CardTitle className="text-2xl 2xl:text-3xl">
            Device Was Force Logged Out
          </CardTitle>
          <CardDescription className="text-base 2xl:text-lg">
            This device was logged out from another location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 text-sm 2xl:text-base text-muted-foreground">
            <p>
              Your account was logged in from another device, which caused this
              session to be terminated.
            </p>
            <p>
              This happened because you&apos;ve reached the maximum limit of 3
              concurrent sessions.
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={handleLoginAgain} className="w-full" size="lg">
              Log In Again
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Cancel
            </Button>
          </div>

          <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-4">
            <p className="text-xs 2xl:text-sm text-blue-900 dark:text-blue-100">
              <strong>Note:</strong> If you log in again, you&apos;ll need to select
              which device to log out from since you&apos;ve reached the 3-device
              limit.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
