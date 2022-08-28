import Image from "next/image";
import Link from "next/link";
import SectionContainer from "../components/admin/table/SectionContainer";
import ScheduleBanner from "../components/home/ScheduleBanner";
import sequelize from "../sequelize";

export const getStaticProps = async () => {
  const { Match, MatchRound, Team } = sequelize.models;

  const matches = await Match.findAll({ raw: true });
  const matchRounds = await MatchRound.findAll({ raw: true });
  let teams = await Team.findAll({ raw: true });

  const groupStageMatches = matches.filter(
    (m) => m.matchWinnerTeamId && !m.isPlayoffsMatch
  );

  // add group stage losses / wins
  teams = teams.map((team) => {
    // return team object WITH new info
    const groupStageWins = groupStageMatches.filter(
      (m) => m.matchWinnerTeamId === team.id && m.season === team.season
    );
    const groupStageLosses = groupStageMatches.filter(
      (m) => m.matchLoserTeamId === team.id && m.season === team.season
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
        (mr) => mr.MatchId === game.id
      );
      return { ...game, matchRounds: matchRoundsForThisGame };
    });

    const dateKey = Object.keys(day)[0];

    return { [dateKey]: datesWithMatchRounds };
  });

  return {
    props: {
      schedule: JSON.parse(JSON.stringify(schedule)),
      teams: JSON.parse(JSON.stringify(teams)),
    },
  };
};

export default function Home({ schedule, teams }) {
  // console.log("schedule", schedule);

  return (
    <>
      <ScheduleBanner schedule={schedule} />
      <SectionContainer>
        <h1 className="text-3xl text-white">home</h1>
      </SectionContainer>
    </>
  );
}
