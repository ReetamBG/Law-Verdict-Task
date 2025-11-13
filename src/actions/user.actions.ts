"use server";

import prisma from "@/lib/prisma";
import { SessionData } from "@auth0/nextjs-auth0/types";
import { cookies } from "next/headers";

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
        sessionConflict: false,
      };
    }

    // If sessions are full and current session doesn't exist, return conflict info
    if (user.sessions.length >= 3) {
      return {
        status: false,
        message: "Maximum active sessions reached. Please log out from another device.",
        data: user,
        sessionConflict: true,
        activeSessions: user.sessions,
      };
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
    console.log("Removing session started");
    
    // Set a cookie to prevent re-validation during logout
    const cookieStore = await cookies();
    cookieStore.set("logging_out", "true", { maxAge: 5 }); // 5 seconds should be enough
    
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
      console.log("Session ID not found in user's active sessions");
      throw new Error("Session not found for user");
    }

    // Remove the session from the user's active sessions
    const updatedSessions = user.sessions.filter((sid) => sid !== sessionId);
    console.log("Updated sessions after filtering:", updatedSessions);
    
    const res = await prisma.user.update({
      where: { auth0Id },
      data: {
        sessions: updatedSessions,
      },
    });

    console.log("Session removal result:", res);
    const user2 = await prisma.user.findUnique({
      where: { auth0Id },
    });
    console.log("Updated sessions after removal:", user2?.sessions);
    
    console.log("Session removed successfully for user:", auth0Id);

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

export async function forceLogoutSession(auth0Id: string, sessionIdToRemove: string, currentSessionId: string) {
  try {
    console.log("Force logout session started");
    
    if (!auth0Id || !sessionIdToRemove || !currentSessionId) {
      throw new Error("Invalid parameters: Missing required IDs");
    }

    // Don't allow force logout of current session
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

    // Remove the target session and add current session
    const updatedSessions = user.sessions.filter((sid) => sid !== sessionIdToRemove);
    updatedSessions.push(currentSessionId);
    
    const res = await prisma.user.update({
      where: { auth0Id },
      data: {
        sessions: updatedSessions,
      },
    });

    console.log("Force logout successful, sessions updated:", res.sessions);

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
