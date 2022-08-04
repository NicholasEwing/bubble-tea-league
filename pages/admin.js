import React, { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import sequelize from "../sequelize";

import SeasonsTable from "../components/admin/SeasonsTable/";
import TeamsTable from "../components/admin/TeamsTable/";
import PlayersTable from "../components/admin/PlayersTable";
import MatchesTable from "../components/admin/MatchesTable";
import { RefreshWrapper } from "../components/admin/context/refreshData";

import SeasonsSection from "../components/admin/SeasonsSection";

export const getStaticProps = async () => {
  const { Season, Team, Player, Match } = sequelize.models;

  const seasons = await Season.findAll({ raw: true });
  const teams = await Team.findAll({ raw: true });
  const players = await Player.findAll({ raw: true });
  const matches = await Match.findAll({ raw: true });

  return {
    props: {
      seasons: JSON.parse(JSON.stringify(seasons)),
      teams: JSON.parse(JSON.stringify(teams)),
      players: JSON.parse(JSON.stringify(players)),
      matches: JSON.parse(JSON.stringify(matches)),
    },
  };
};

export default function Dashboard({ seasons, teams, players, matches }) {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") signIn();
  }, [status]);

  if (status !== "authenticated") {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="py-8 px-4">
      <RefreshWrapper>
        <SeasonsSection items={seasons} />
        {/* <TeamsTable teams={teams} /> */}
        {/* <PlayersTable teams={teams} players={players} /> */}
        {/* <MatchesTable teams={teams} matches={matches} /> */}
        <h2>Free Agents</h2>
      </RefreshWrapper>
    </div>
  );
}
