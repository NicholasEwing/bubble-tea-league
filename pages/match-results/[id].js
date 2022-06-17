import { useRouter } from "next/router";
import { Op } from "sequelize";
import TeamResults from "../../components/match-results/TeamResults";
const sequelize = require("../../sequelize/index");
const { Match, MatchRound, MatchRoundTeamStats } = sequelize.models;

export const getStaticPaths = async () => {
  const matches = await Match.findAll({ raw: true });

  const paths = matches.map((match) => {
    return {
      params: { id: match.id.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  const { id } = context.params;
  const match = await Match.findByPk(id, { raw: true });

  const matchRounds = await MatchRound.findAll({
    where: {
      MatchId: id,
      winningTeamId: { [Op.not]: null },
      losingTeamId: { [Op.not]: null },
    },
    raw: true,
  });

  const matchRoundTeamStats = await Promise.all(
    matchRounds.map(async (round) => {
      const teamStats = await MatchRoundTeamStats.findAll({
        where: { MatchRoundId: round.id },
        raw: true,
      });

      return teamStats;
    })
  );

  // get match round player stats
  return {
    props: {
      match: JSON.parse(JSON.stringify(match)),
      matchRounds: JSON.parse(JSON.stringify(matchRounds)),
      matchRoundTeamStats: JSON.parse(JSON.stringify(matchRoundTeamStats)),
    },
  };
};

export default function MatchResults({
  match,
  matchRounds,
  matchRoundTeamStats,
}) {
  console.log("Match round team stats", matchRoundTeamStats);
  return (
    <div className="grid place-items-center">
      <h1>Match Results</h1>
      <p>Page for Match ID: {match.id}</p>
      <p className="font-bold text-lg">Rounds:</p>
      <ul>
        {matchRounds.map((round) => (
          <li key={round.id}>
            <p>Round Id: {round.id}</p>
            <p>Tournament Code: {round.tournamentCode}</p>
            <p>Winning team: {round.winningTeamId}</p>
            <p>Losing team: {round.losingTeamId}</p>
          </li>
        ))}
      </ul>
      <h2>Match Results</h2>
      <div className="flex w-1/2 justify-between">
        {matchRoundTeamStats.map((gameResults, i) => {
          return gameResults.map((teamStats, j) => (
            <TeamResults key={j} teamStats={teamStats} />
          ));
        })}
      </div>
    </div>
  );
}
