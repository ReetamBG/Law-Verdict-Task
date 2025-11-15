"use server";

import prisma from "@/lib/prisma";
import { SessionData } from "@auth0/nextjs-auth0/types";
import { cookies } from "next/headers";

const MAX_DEVICES = parseInt(process.env.NEXT_PUBLIC_MAX_DEVICES || "3", 10);

export async function validateSession(sessionInfo: SessionData) {
  try {
    const auth0Id = sessionInfo.user.sub;
    const sessionId = sessionInfo.internal.sid;

    if (!auth0Id || !sessionId) {
      throw new Error("Invalid session: Missing auth0Id or sessionId");
    }

    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      // throw new Error("User not found");
      return {
        status: false,
        message: "User not found",
      };
    }

    const sessionExists = user.sessions.includes(sessionId);

    if (sessionExists) {
      return {
        status: true,
        message: "Session already validated",
        data: user,
        sessionConflict: false,
      };
    }

    if (user.sessions.length >= MAX_DEVICES) {
      return {
        status: false,
        message: "Maximum active sessions reached. Please log out from another device.",
        data: user,
        sessionConflict: true,
        activeSessions: user.sessions,
      };
    }

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
      sessionConflict: false,
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
    const cookieStore = await cookies();
    cookieStore.set("logging_out", "true", { maxAge: 5 });
    
    const auth0Id = sessionInfo.user.sub;
    const sessionId = sessionInfo.internal.sid;

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

export async function setLoggingOutCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("logging_out", "true", { maxAge: 10 });
    
    return {
      status: true,
      message: "Cookie set successfully",
    };
  } catch (error) {
    console.error("Error setting cookie:", error);
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function forceLogoutSession(auth0Id: string, sessionIdToRemove: string, currentSessionId: string) {
  try {
    if (!auth0Id || !sessionIdToRemove || !currentSessionId) {
      throw new Error("Invalid parameters: Missing required IDs");
    }

    if (sessionIdToRemove === currentSessionId) {
      throw new Error("Cannot force logout current session");
    }

    const user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const sessionExists = user.sessions.includes(sessionIdToRemove);
    if (!sessionExists) {
      throw new Error("Session to remove not found in user's active sessions");
    }

    const updatedSessions = user.sessions.filter((sid) => sid !== sessionIdToRemove);
    updatedSessions.push(currentSessionId);
    
    const res = await prisma.user.update({
      where: { auth0Id },
      data: {
        sessions: updatedSessions,
      },
    });

    return {
      status: true,
      message: "Session force logged out successfully",
      data: res,
    };
  } catch (error) {
    console.error("Force logout error:", error);
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
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
