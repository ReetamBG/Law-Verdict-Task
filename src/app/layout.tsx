import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import RootNavbar from "@/components/Navbar";
import { auth0 } from "@/lib/auth0";
import { getDbUserByAuth0Id, validateSession } from "@/actions/user.actions";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Law & Verdict",
  description: "On a mission to build the most user-friendly search engine for lawyers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();
  const cookieStore = await cookies();
  const isLoggingOut = cookieStore.get("logging_out");
  
  // Get current pathname to avoid redirect loops
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || headersList.get("referer") || "";
  const isSessionConflictPage = pathname.includes("/session-conflict");
  const isForceLogoutPage = pathname.includes("/force-logout");

  // Don't validate session if user is logging out or already on conflict/logout pages
  if (session && !isLoggingOut && !isSessionConflictPage && !isForceLogoutPage) {
    const validationResult = await validateSession(session!);
    
    // If session conflict (N+1), redirect to session conflict page
    if (validationResult.sessionConflict) {
      redirect("/session-conflict");
    }
    
    // If session validation failed and it's not a conflict, check if session was force-logged-out
    if (!validationResult.status && !validationResult.sessionConflict) {
      // Check if current session is in the user's active sessions
      const userResult = await getDbUserByAuth0Id(session.user.sub!);
      if (userResult.status && userResult.data) {
        const currentSessionId = session.internal.sid;
        const isSessionActive = userResult.data.sessions.includes(currentSessionId);
        
        // If session is not in active sessions, user was force-logged-out
        if (!isSessionActive) {
          redirect("/force-logout");
        }
      }
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen w-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <RootNavbar session={session} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
