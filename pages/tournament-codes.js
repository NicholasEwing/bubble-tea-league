import React, { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import sequelize from "../sequelize";
import admins from "../sequelize/admins";

import MatchesSection from "../components/admin/Sections/MatchesSection";
import Warning from "../components/tournament-codes/warning";
import SectionContainer from "../components/admin/table/SectionContainer";
import { Op } from "sequelize";

export const getStaticProps = async () => {
  let playerEmails, teams, matches, matchRounds;
  try {
    const { Match, MatchRound, Team, Player } = sequelize.models;

    const playerEmailObjs = await Player?.findAll({
      raw: true,
      attributes: ["email"],
    });
    playerEmails = playerEmailObjs?.map((o) => o.email);
    teams = await Team?.findAll({ raw: true });
    matches = await Match?.findAll({
      raw: true,
      where: {
        matchWinnerTeamId: {
          [Op.is]: null,
        },
      },
    });
    matchRounds = await MatchRound?.findAll({ raw: true });
  } catch (error) {
    return {
      notFound: true,
    };
  }

  if (!playerEmails || !teams || !matches || !matchRounds) {
    return {
      notFound: true,
    };
  }

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
  const isPlayer =
    playerEmails.includes(sessionInfo?.data?.user?.email) ||
    admins.includes(sessionInfo?.data?.user?.email);

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
        Must be an admitted Bubble Tea League player or admin to view this page.
      </h2>
    );

  if (status !== "authenticated") {
    return <h2>Loading...</h2>;
  }

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
}
