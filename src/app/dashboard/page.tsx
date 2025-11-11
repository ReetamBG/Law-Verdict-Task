import { getDbUserByAuth0Id, syncAuth0UserToDb } from "@/actions/user.actions";
import CompleteProfileForm from "@/components/CompleteProfileForm";
import { auth0 } from "@/lib/auth0";
import { redirect, RedirectType } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const session = await auth0.getSession();
  if (!session) {
    redirect("/auth/login", RedirectType.replace);
  }

  console.log(session)

  const res = await getDbUserByAuth0Id(session.user.sub!);
  if (!res.status) {
    await syncAuth0UserToDb(session.user.sub!);
    // sync auth0 user with db not here maybe better to do in navbar where it only happens once
  }

  const dbUser = res.data;

  return (
    <section className="min-h-screen w-full flex justify-center pt-30">
      {dbUser?.isProfileComplete ? (
        <div className="text-center space-y-4">
          <h1 className="text-4xl 2xl:text-5xl font-bold text-primary">Welcome to your Dashboard!</h1>
          <div className="text-lg 2xl:text-xl text-muted-foreground">
            <p>
              Hello, {dbUser?.firstName} {dbUser?.lastName}
            </p>
            <p>Phone: {dbUser?.phoneNo}</p>
            <p>You are logged in as {session.user.name}</p>
            <p>Current active devices: {dbUser.sessions.length}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6">
          <CompleteProfileForm userId={dbUser?.id} />
        </div>
      )}
    </section>
  );
};

export default Dashboard;
