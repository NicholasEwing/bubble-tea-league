import React, { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

export default function Dashboard() {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") signIn();
  }, [status]);

  if (status !== "authenticated") {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <div>Dashboard</div>
    </>
  );
}
