import Image from "next/image";
import Link from "next/link";
import SectionContainer from "../components/admin/table/SectionContainer";
import HomeContent from "../components/home/HomeContent";
import RecentVods from "../components/home/RecentVods";
import ScheduleBanner from "../components/home/ScheduleBanner";
import WhatIsBtl from "../components/home/WhatIsBtl";
import { dateInPast, isToday } from "../lib/utils";

export const getStaticProps = async () => {
  const { prisma } = require("../prisma/db");
  const matches = await prisma.match.findMany();
  const matchRounds = await prisma.matchRound.findMany();
  let teams = await prisma.team.findMany();

  if (!teams || !matches || !matchRounds) {
    return {
      notFound: true,
    };
  }

  const groupStageMatches = matches.filter(
    (m) => m.matchWinnerTeamId && !m.isPlayoffsMatch
  );

  // add group stage losses / wins
  teams = teams.map((team) => {
    // return team object WITH new info
    const groupStageWins = groupStageMatches.filter(
      (m) => m.matchWinnerTeamId === team.id && m.seasonId === team.seasonId
    );
    const groupStageLosses = groupStageMatches.filter(
      (m) => m.matchLoserTeamId === team.id && m.seasonId === team.seasonId
    );
    return { ...team, groupStageWins, groupStageLosses };
  });

  // thanks stack overflow <3
  const groupByKey = (list, key) =>
    list.reduce(
      (hash, obj) => ({
        ...hash,
        [obj[key]]: (hash[obj[key]] || []).concat(obj),
      }),
      {}
    );

  const groupedMatches = groupByKey(matches, "scheduledTime");

  let schedule = Object.entries(groupedMatches).map(([key, value]) => {
    return { [key]: value };
  });

  // smack matchRound info inside each match object so we can count
  // wins / losses for playoffs matches and get other info we might want later
  schedule = schedule.map((day) => {
    const games = Object.values(day).flat();

    const datesWithMatchRounds = games.map((game) => {
      const matchRoundsForThisGame = matchRounds.filter(
        (mr) => mr.matchId === game.id
      );
      return { ...game, matchRounds: matchRoundsForThisGame };
    });

    const dateKey = Object.keys(day)[0];

    return { [dateKey]: datesWithMatchRounds };
  });

  schedule.sort((a, b) => {
    const dateA = Object.keys(a)[0];
    const dateB = Object.keys(b)[0];
    return new Date(dateA) - new Date(dateB);
  });

  return {
    props: {
      schedule: JSON.parse(JSON.stringify(schedule)),
      teams: JSON.parse(JSON.stringify(teams)),
    },
  };
};

export default function Home({ schedule = null, teams = null }) {
  const today = new Date();

  const pastSchedule = schedule.filter((s) => {
    const date = new Date(Object.keys(s)[0]);
    return dateInPast(date, today);
  });

  // remove past items from schedule
  const futureSchedule = schedule.filter((s) => {
    const date = new Date(Object.keys(s)[0]);
    return !dateInPast(date, today);
  });

  // if schedule contains match today
  let featuredMatch;
  futureSchedule.find((dateObj) => {
    const date = new Date(Object.keys(dateObj)[0]);

    if (isToday(date)) {
      return Object.values(dateObj)
        .flat()
        .find((match) => {
          featuredMatch = match;
        });
    } else {
      return false;
    }
  });

  return (
    <>
      {futureSchedule.length > 0 && (
        <ScheduleBanner schedule={futureSchedule} teams={teams} />
      )}
      {featuredMatch && (
        <HomeContent
          teamOne={teams.find((t) => t.id === featuredMatch?.teamOneId)}
          teamTwo={teams.find((t) => t.id === featuredMatch?.teamTwoId)}
          bestOf={featuredMatch?.isPlayoffsMatch ? "Bo3" : "Bo1"}
          scheduledTime={featuredMatch?.scheduledTime}
          season={featuredMatch?.season}
        />
      )}
      <WhatIsBtl />
      {pastSchedule.length > 0 && (
        <SectionContainer>
          <RecentVods teams={teams} pastSchedule={pastSchedule} />
        </SectionContainer>
      )}
    </>
  );
}
