"use server";

import prisma from "@/lib/prisma";

export async function syncAuth0UserToDb(auth0Id: string) {
  if (!auth0Id) {
    return {
      status: false,
      message: "Invalid Auth0 ID",
    };
  }

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
  if (!auth0Id) {
    return {
      status: false,
      message: "Invalid Auth0 ID",
    };
  }

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
  if (!userId) {
    return {
      status: false,
      message: "Invalid User ID",
    };
  }

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
