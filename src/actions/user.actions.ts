"use server";

import prisma from "@/lib/prisma";
import { SessionData } from "@auth0/nextjs-auth0/types";

export async function validateSession(sessionInfo: SessionData) {
  try {
    const auth0Id = sessionInfo.user.sub; // auth0 user id
    const sessionId = sessionInfo.internal.sid; // session id (unique to each login session and device)

    if (!auth0Id || !sessionId) {
      throw new Error("Invalid session: Missing auth0Id or sessionId");
    }

    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if current session already exists
    // If session already exists, allow normal login
    const sessionExists = user.sessions.includes(sessionId);

    if (sessionExists) {
      return {
        status: true,
        message: "Session already validated",
        data: user,
      };
    }

    // If sessions are full and current session doesn't exist, block login
    if (user.sessions.length >= 3) {
      throw new Error(
        "Maximum active sessions reached. Please log out from another device."
      );
    }

    // If new session and space left then add it to the array
    const updatedSessions = [...user.sessions, sessionId];

    const res = await prisma.user.update({
      where: { auth0Id },
      data: {
        sessions: updatedSessions,
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
    };
  }
}

export async function removeSession(sessionInfo: SessionData) {
  try {
    const auth0Id = sessionInfo.user.sub; // auth0 user id
    const sessionId = sessionInfo.internal.sid; // session id (unique to each login session and device)

    if (!auth0Id || !sessionId) {
      throw new Error("Invalid session: Missing auth0Id or sessionId");
    }

    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const sessionExists = user.sessions.includes(sessionId);
    if (!sessionExists) {
      throw new Error("Session not found for user");
    }

    // Remove the session from the user's active sessions
    const updatedSessions = user.sessions.filter((sid) => sid !== sessionId);

    const res = await prisma.user.update({
      where: { auth0Id },
      data: {
        sessions: updatedSessions,
      },
    });

    return {
      status: true,
      message: "Session removed successfully",
      data: res,
    };
  } catch (error) {
    console.error("Session removal error:", error);
    return {
      status: false,
      message: error,
    };
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
