import React, { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

import sequelize from "../sequelize";

import { RefreshWrapper } from "../components/admin/context/refreshData";

import SeasonsSection from "../components/admin/Sections/SeasonsSection";
import TeamsSection from "../components/admin/Sections/TeamsSection";
import MatchesSection from "../components/admin/Sections/MatchesSection";
import PlayersSection from "../components/admin/Sections/PlayersSection";
import FreeAgentsSection from "../components/admin/Sections/FreeAgentsSection";

import admins from "../sequelize/admins";

export const getStaticProps = async () => {
  const { Season, Team, Player, Match, PlayerTeamHistory, MatchRound } =
    sequelize.models;

  const seasons = await Season.findAll({ raw: true });
  const teams = await Team.findAll({ raw: true });
  const allPlayers = await Player.findAll({ raw: true });
  const matches = await Match.findAll({ raw: true });
  const matchRounds = await MatchRound.findAll({ raw: true });
  const playerTeamHistory = await PlayerTeamHistory.findAll({ raw: true });

  const players = allPlayers.filter((p) => !p.isFreeAgent);
  const freeAgents = allPlayers.filter((p) => p.isFreeAgent);

  return {
    props: {
      seasons: JSON.parse(JSON.stringify(seasons)),
      teams: JSON.parse(JSON.stringify(teams)),
      players: JSON.parse(JSON.stringify(players)),
      freeAgents: JSON.parse(JSON.stringify(freeAgents)),
      matches: JSON.parse(JSON.stringify(matches)),
      matchRounds: JSON.parse(JSON.stringify(matchRounds)),
      playerTeamHistory: JSON.parse(JSON.stringify(playerTeamHistory)),
    },
  };
};

export default function Dashboard({
  seasons,
  teams,
  players,
  freeAgents,
  matches,
  matchRounds,
  playerTeamHistory,
}) {
  const router = useRouter();

  const sessionInfo = useSession();

  const { status } = useSession();
  const isAdmin = admins.includes(sessionInfo?.data?.user?.email);

  useEffect(() => {
    if (status === "authenticated" && !isAdmin) router.push("/");
  }, [status, isAdmin, router]);

  useEffect(() => {
    if (status === "unauthenticated") signIn();
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

  return (
    <div className="py-8 px-4">
      <RefreshWrapper>
        <SeasonsSection items={seasons} />
        <TeamsSection items={teams} />
        <MatchesSection
          items={matches}
          teams={teams}
          matchRounds={matchRounds}
        />
        <PlayersSection
          items={players}
          teams={teams}
          seasons={seasons}
          playerTeamHistory={playerTeamHistory}
        />
        <FreeAgentsSection items={freeAgents} />
        <h2>Free Agents</h2>
      </RefreshWrapper>
    </div>
  );
}
