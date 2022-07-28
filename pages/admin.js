import React, { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import sequelize from "../sequelize";

import SeasonsTable from "../components/admin/SeasonsTable";
import TeamsTable from "../components/admin/TeamsTable";

export const getStaticProps = async () => {
  const { Season, Team } = sequelize.models;

  const seasons = await Season.findAll({ raw: true });
  const teams = await Team.findAll({ raw: true });

  return {
    props: {
      seasons: JSON.parse(JSON.stringify(seasons)),
      teams: JSON.parse(JSON.stringify(teams)),
    },
  };
};

export default function Dashboard({ seasons, teams }) {
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") signIn();
  }, [status]);

  if (status !== "authenticated") {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="py-8 px-4">
      <SeasonsTable seasons={seasons} />
      <TeamsTable teams={teams} />
      <h2>Players</h2>
      <h2>Free Agents</h2>
    </div>
  );
}
