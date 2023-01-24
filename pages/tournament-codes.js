import React, { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

import MatchesSection from "../components/admin/Sections/MatchesSection";
import Warning from "../components/tournament-codes/warning";
import SectionContainer from "../components/Containers/SectionContainer";
import admins from "../admins";

export const getStaticProps = async () => {
  const { prisma } = require("../prisma/db");

  const playerEmails = (
    await prisma.player.findMany({
      select: {
        email: true,
      },
    })
  ).map((o) => o.email);
  const teams = await prisma.team.findMany();

  const matches = await prisma.match.findMany({
    where: {
      matchWinnerTeamId: null,
    },
  });
  const matchRounds = await prisma.matchRound.findMany();

  return {
    props: {
      playerEmails: JSON.parse(JSON.stringify(playerEmails)),
      teams: JSON.parse(JSON.stringify(teams)),
      matches: JSON.parse(JSON.stringify(matches)),
      matchRounds: JSON.parse(JSON.stringify(matchRounds)),
    },
  };
};

export default function Dashboard({
  playerEmails = null,
  teams = null,
  matches = null,
  matchRounds = null,
}) {
  const router = useRouter();

  const sessionInfo = useSession();
  const { status } = useSession();
  const isAdmin = admins.includes(sessionInfo?.data?.user?.email);
  const isPlayer = playerEmails?.includes(sessionInfo?.data?.user?.email);

  useEffect(() => {
    if (status === "authenticated" && !isPlayer && !isAdmin)
      router.push("/tournament-codes");
  }, [status, isPlayer, isAdmin, router]);

  useEffect(() => {
    if (status === "unauthenticated")
      signIn("discord", undefined, { prompt: "none" });
  }, [status]);

  if (isPlayer || isAdmin)
    return (
      <>
        <SectionContainer>
          <Warning />
        </SectionContainer>
        <MatchesSection
          items={matches}
          teams={teams}
          matchRounds={matchRounds}
          isPublic
        />
      </>
    );

  if (!isAdmin && !isPlayer && status === "authenticated")
    return (
      <h2 className="mt-6 text-center text-3xl text-white">
        Must be an admitted Bubble Tea League player or admin to view this page.
      </h2>
    );

  if (status !== "authenticated") {
    return <h2>Loading...</h2>;
  }
}
