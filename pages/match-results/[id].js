import { useRouter } from "next/router";
import { Op } from "sequelize";
import MatchContainer from "../../components/match-results/MatchContainer";
import TeamResults from "../../components/match-results/TeamResults";
const sequelize = require("../../sequelize/index");
const { Match, MatchRound, MatchRoundTeamStats, MatchRoundPlayerStats, Team } =
  sequelize.models;

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
      blueTeamId: { [Op.not]: null },
      redTeamId: { [Op.not]: null },
    },
    raw: true,
  });

  // find losing team
  // const round = matchRounds.map((round) => {
  //   const { blueTeamId, redTeamId, winningTeamId } = round;
  //   const losingTeamId = [blueTeamId, redTeamId].find(
  //     (id) => id !== winningTeamId
  //   );

  //   return {
  //     ...round,
  //     losingTeamId, // add losing team to the obj since we don't store it in db
  //   };
  // });

  // find team names
  const roundsWithTeamNames = await Promise.all(
    matchRounds.map(async (round) => {
      const { blueTeamId, redTeamId, winningTeamId } = round;
      const teams = await Team.findAll({
        attributes: ["id", "teamName"],
        raw: true,
      });
      const blueTeam = teams.find((team) => team.id === blueTeamId);
      const redTeam = teams.find((team) => team.id === redTeamId);
      const winningTeam = teams.find((team) => team.id === winningTeamId);
      const losingTeam = teams.find((team) => team.id !== winningTeamId);

      return {
        ...round,
        blueTeamName: blueTeam.teamName,
        redTeamName: redTeam.teamName,
        winningTeamName: winningTeam.teamName,
        losingTeamName: losingTeam.teamName,
        losingTeamId: losingTeam.id,
      };
    })
  );

  console.log("round info", roundsWithTeamNames);

  const matchRoundTeamStats = await Promise.all(
    matchRounds.map(async (round) => {
      const teamStats = await MatchRoundTeamStats.findAll({
        where: { MatchRoundId: round.id },
        raw: true,
      });

      return teamStats;
    })
  );

  const matchRoundPlayerStats = await Promise.all(
    matchRounds.map(async (round) => {
      const playerStats = await MatchRoundPlayerStats.findAll({
        where: { MatchRoundId: round.id },
        raw: true,
      });

      return playerStats;
    })
  );

  // get match round player stats
  return {
    props: {
      match: JSON.parse(JSON.stringify(match)),
      matchRounds: JSON.parse(JSON.stringify(roundsWithTeamNames)),
      matchRoundTeamStats: JSON.parse(JSON.stringify(matchRoundTeamStats)),
      matchRoundPlayerStats: JSON.parse(JSON.stringify(matchRoundPlayerStats)),
    },
  };
};

export default function MatchResults({
  match,
  matchRounds,
  matchRoundTeamStats,
  matchRoundPlayerStats,
}) {
  return (
    <MatchContainer matchId={match.id}>
      <p className="font-bold text-lg">Rounds:</p>
      <ul>
        {matchRounds.map((round) => (
          <div key={round.id}>
            <p>Round Id: {round.id}</p>
            <p>Tournament Code: {round.tournamentCode}</p>
            <p>Winning team: {round.winningTeamName}</p>
            <p>Losing team: {round.losingTeamName}</p>
          </div>
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
    </MatchContainer>
  );
}
