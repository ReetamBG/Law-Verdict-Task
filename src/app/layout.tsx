import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import RootNavbar from "@/components/Navbar";
import { auth0 } from "@/lib/auth0";
import { validateSession } from "@/actions/user.actions";
import { cookies } from "next/headers";

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

  // Don't validate session if user is logging out
  if (session && !isLoggingOut) {
    await validateSession(session!);
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
