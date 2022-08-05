import React, { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import sequelize from "../sequelize";

import { RefreshWrapper } from "../components/admin/context/refreshData";

import SeasonsSection from "../components/admin/SeasonsSection";
import TeamsSection from "../components/admin/TeamsSection/";

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
        <TeamsSection items={teams} />
        <h2>Free Agents</h2>
      </RefreshWrapper>
    </div>
  );
}
