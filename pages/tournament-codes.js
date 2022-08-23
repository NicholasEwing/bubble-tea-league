import React, { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import sequelize from "../sequelize";
import players from "../sequelize/players";

import MatchesSection from "../components/admin/Sections/MatchesSection";
import Warning from "../components/tournament-codes/warning";
import SectionContainer from "../components/admin/table/SectionContainer";
import { Op } from "sequelize";

export const getStaticProps = async () => {
  const { Match, MatchRound, Team } = sequelize.models;

  const teams = await Team.findAll({ raw: true });
  const matches = await Match.findAll({
    raw: true,
    where: {
      matchWinnerTeamId: {
        [Op.is]: null,
      },
    },
  });
  const matchRounds = await MatchRound.findAll({ raw: true });

  return {
    props: {
      teams: JSON.parse(JSON.stringify(teams)),
      matches: JSON.parse(JSON.stringify(matches)),
      matchRounds: JSON.parse(JSON.stringify(matchRounds)),
    },
  };
};

export default function Dashboard({ teams, matches, matchRounds }) {
  const router = useRouter();

  const sessionInfo = useSession();

  const { status } = useSession();
  const isPlayer = players.includes(sessionInfo?.data?.user?.email);

  useEffect(() => {
    if (status === "authenticated" && !isPlayer)
      router.push("/tournament-codes");
  }, [status, isPlayer, router]);

  useEffect(() => {
    if (status === "unauthenticated") signIn("discord");
  }, [status]);

  if (!isPlayer && status === "authenticated")
    return (
      <h2 className="mt-6 text-center text-3xl text-white">
        Must be an admitted Bubble Tea League player to view this page.
      </h2>
    );

  if (status !== "authenticated") {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="py-8 px-4">
      <SectionContainer>
        <Warning />
      </SectionContainer>
      <MatchesSection
        items={matches}
        teams={teams}
        matchRounds={matchRounds}
        isPublic
      />
    </div>
  );
}
