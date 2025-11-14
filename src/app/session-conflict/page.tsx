import { auth0 } from "@/lib/auth0";
import { getDbUserByAuth0Id } from "@/actions/user.actions";
import { redirect } from "next/navigation";
import SessionConflictClient from "./SessionConflictClient";

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

  // If user has less than 3 sessions, redirect to dashboard
  if (activeSessions.length < 3) {
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
