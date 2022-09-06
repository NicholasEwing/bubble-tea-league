import React, { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { RefreshWrapper } from "../components/admin/context/refreshData";
import ProviderSection from "../components/admin/Sections/ProviderSection";
import SeasonsSection from "../components/admin/Sections/SeasonsSection";
import TeamsSection from "../components/admin/Sections/TeamsSection";
import MatchesSection from "../components/admin/Sections/MatchesSection";
import PlayersSection from "../components/admin/Sections/PlayersSection";
import FreeAgentsSection from "../components/admin/Sections/FreeAgentsSection";

import admins from "../admins";

export const getStaticProps = async () => {
  const { prisma } = require("../prisma/db");

  const provider = await prisma.provider.findMany();
  const seasons = await prisma.season.findMany();
  const teams = await prisma.team.findMany();
  const allPlayers = await prisma.player.findMany();
  const matches = await prisma.match.findMany();
  const matchRounds = await prisma.matchRound.findMany();
  const matchRoundTeamStats = await prisma.matchRoundTeamStats.findMany();
  const matchRoundPlayerStats = await prisma.matchRoundPlayerStats.findMany();
  const playerTeamHistories = await prisma.playerTeamHistory.findMany();

  const players = allPlayers.filter((p) => !p.isFreeAgent);
  const freeAgents = allPlayers.filter((p) => p.isFreeAgent);

  return {
    props: {
      provider: JSON.parse(JSON.stringify(provider)),
      seasons: JSON.parse(JSON.stringify(seasons)),
      teams: JSON.parse(JSON.stringify(teams)),
      players: JSON.parse(JSON.stringify(players)),
      freeAgents: JSON.parse(JSON.stringify(freeAgents)),
      matches: JSON.parse(JSON.stringify(matches)),
      matchRounds: JSON.parse(JSON.stringify(matchRounds)),
      playerTeamHistories: JSON.parse(JSON.stringify(playerTeamHistories)),
    },
  };
};

export default function Dashboard({
  provider = null,
  seasons = null,
  teams = null,
  players = null,
  freeAgents = null,
  matches = null,
  matchRounds = null,
  playerTeamHistories = null,
}) {
  const router = useRouter();

  const sessionInfo = useSession();

  const { status } = useSession();
  const isAdmin = admins.includes(sessionInfo?.data?.user?.email);

  useEffect(() => {
    if (status === "authenticated" && !isAdmin) router.push("/");
  }, [status, isAdmin, router]);

  useEffect(() => {
    if (status === "unauthenticated") signIn("discord");
  }, [status]);

  if (!isAdmin && status === "authenticated")
    return (
      <h2 className="mt-6 text-center text-3xl text-white">
        Must be an admin to view this page.
      </h2>
    );

  if (status !== "authenticated") {
    return <h2>Loading...</h2>;
  }

  console.log("provider", provider);

  return (
    <RefreshWrapper>
      {provider.length === 0 && <ProviderSection provider={provider} />}
      <SeasonsSection items={seasons} />
      <TeamsSection items={teams} />
      <MatchesSection items={matches} teams={teams} matchRounds={matchRounds} />
      <PlayersSection
        items={players}
        teams={teams}
        seasons={seasons}
        playerTeamHistories={playerTeamHistories}
      />
      <FreeAgentsSection items={freeAgents} />
    </RefreshWrapper>
  );
}
