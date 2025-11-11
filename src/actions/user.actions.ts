"use server";

import prisma from "@/lib/prisma";
import { SessionData } from "@auth0/nextjs-auth0/types";

export async function validateSession(sessionInfo: SessionData) {
  try {
    const auth0Id = sessionInfo.user.sub;          // auth0 user id
    const sessionId = sessionInfo.internal.sid;   // session id (unique to each login session and device)
    if (!auth0Id) {
      throw new Error("Invalid session: Missing auth0Id");
    }

    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // if sessions filled and does not include current sessionId, block login
    if (user.sessions.length >= 3 && !user?.sessions.includes(sessionId) ) {
      throw new Error("Maximum active sessions reached");
    }

    const res = await prisma.user.update({
      where: { auth0Id },
      data: {
        sessions: [...user.sessions, sessionId],
      },
    });

    return {
      status: true,
      message: "Session validated and updated",
      data: res,
    };

  } catch (error) {
    console.error("Session validation error:", error);
    return {
      status: false,
      message: error,
    }
  }
}

export async function syncAuth0UserToDb(auth0Id: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: { auth0Id },
      });
    }

    return {
      status: true,
      message: "User synced successfully",
    };
  } catch (error) {
    return {
      status: false,
      message: error,
    };
  }
}

export async function getDbUserByAuth0Id(auth0Id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      return {
        status: false,
        message: "User not found",
        data: null,
      };
    }

    return {
      status: true,
      message: "User fetched successfully",
      data: user,
    };
  } catch (error) {
    return {
      status: false,
      message: error,
      data: null,
    };
  }
}

export async function updateUserProfile(
  userId: string,
  profileData: {
    firstName: string;
    lastName: string;
    phoneNo: string;
  }
) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNo: profileData.phoneNo,
        isProfileComplete: true,
      },
    });

    return {
      status: true,
      message: "Profile updated successfully",
      data: updatedUser,
    };
  } catch (error) {
    return {
      status: false,
      message: error,
    };
  }
}
