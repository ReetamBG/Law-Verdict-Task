"use client";

import React from "react";
import SessionConflictDialog from "./SessionConflictDialog";

interface SessionConflictWrapperProps {
  activeSessions: string[];
  currentSessionId: string;
  auth0Id: string;
}

const SessionConflictWrapper = ({
  activeSessions,
  currentSessionId,
  auth0Id,
}: SessionConflictWrapperProps) => {
  return (
    <SessionConflictDialog
      open={true}
      onClose={() => {
        // Redirect to home on close (cancel login)
        window.location.href = "/";
      }}
      activeSessions={activeSessions}
      currentSessionId={currentSessionId}
      auth0Id={auth0Id}
    />
  );
};

export default SessionConflictWrapper;
