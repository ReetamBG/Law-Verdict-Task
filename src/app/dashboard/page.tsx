import {
  getDbUserByAuth0Id,
  syncAuth0UserToDb,
} from "@/actions/user.actions";
import ActiveSessionsCard from "@/components/ActiveSessionsCard";
import CompleteProfileForm from "@/components/CompleteProfileForm";
import { auth0 } from "@/lib/auth0";
import { redirect, RedirectType } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const session = await auth0.getSession();
  if (!session) {
    redirect("/auth/login", RedirectType.replace);
  }

  let res = await getDbUserByAuth0Id(session.user.sub!);
  if (!res.status) {
    await syncAuth0UserToDb(session.user.sub!);
    // Re-fetch the user after syncing to get the newly created user
    res = await getDbUserByAuth0Id(session.user.sub!);
  }

  const dbUser = res.data;

  return (
    <section className="min-h-screen w-full flex justify-center items-center pt-20 pb-10 px-4">
      <div className="w-full max-w-4xl">
        {dbUser?.isProfileComplete ? (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl 2xl:text-5xl font-bold text-primary">
                Welcome, {dbUser?.firstName}!
              </h1>
              <div className="text-lg 2xl:text-xl text-muted-foreground space-y-2">
                <p className="font-semibold">
                  {dbUser?.firstName} {dbUser?.lastName}
                </p>
                <p className="text-base 2xl:text-lg">
                  Phone: {dbUser?.phoneNo}
                </p>
                <p className="text-sm 2xl:text-base text-muted-foreground/70">
                  Logged in as {session.user.email}
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <ActiveSessionsCard
                sessions={dbUser.sessions}
                currentSessionId={session.internal.sid}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <CompleteProfileForm userId={dbUser?.id} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
