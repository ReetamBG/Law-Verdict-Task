import { auth0 } from "@/lib/auth0";
import { getDbUserByAuth0Id } from "@/actions/user.actions";
import { redirect } from "next/navigation";
import SessionConflictClient from "./SessionConflictClient";

const MAX_DEVICES = parseInt(process.env.NEXT_PUBLIC_MAX_DEVICES || "3", 10);

export default async function SessionConflictPage() {
  const session = await auth0.getSession();
  
  if (!session) {
    redirect("/auth/login");
  }

  // Get user data to fetch active sessions
  const userResult = await getDbUserByAuth0Id(session.user.sub!);
  
  if (!userResult.status || !userResult.data) {
    redirect("/auth/login");
  }

  const activeSessions = userResult.data.sessions;
  const currentSessionId = session.internal.sid;
  const auth0Id = session.user.sub!;

  // If user has less than MAX_DEVICES sessions, redirect to dashboard
  if (activeSessions.length < MAX_DEVICES) {
    redirect("/dashboard");
  }

  return (
    <SessionConflictClient
      activeSessions={activeSessions}
      currentSessionId={currentSessionId}
      auth0Id={auth0Id}
    />
  );
}
