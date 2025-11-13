import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ForceLogoutPage() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 2xl:w-20 2xl:h-20 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 2xl:h-10 2xl:w-10 text-orange-600 dark:text-orange-500" />
          </div>
          <CardTitle className="text-2xl 2xl:text-3xl">
            Session Logged Out
          </CardTitle>
          <CardDescription className="text-base 2xl:text-lg">
            You were logged out from this device
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
            <Link href="/auth/login" className="block">
              <Button className="w-full" size="lg">
                Log In Again
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="outline" className="w-full" size="lg">
                Go to Home
              </Button>
            </Link>
          </div>

          <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-4">
            <p className="text-xs 2xl:text-sm text-blue-900 dark:text-blue-100">
              <strong>Tip:</strong> You can manage your active sessions by
              logging out from devices you&apos;re no longer using.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
