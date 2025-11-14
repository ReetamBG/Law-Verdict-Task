import { getDbUserByAuth0Id } from "@/actions/user.actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { auth0Id, currentSessionId } = await request.json();

    if (!auth0Id || !currentSessionId) {
      return NextResponse.json(
        { isValid: false, error: "Missing parameters" },
        { status: 400 }
      );
    }

    const userResult = await getDbUserByAuth0Id(auth0Id);

    if (!userResult.status || !userResult.data) {
      return NextResponse.json({ isValid: false });
    }

    const isValid = userResult.data.sessions.includes(currentSessionId);

    return NextResponse.json({ isValid });
  } catch (error) {
    console.error("Error checking session:", error);
    return NextResponse.json(
      { isValid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
