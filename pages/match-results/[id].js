import Image from "next/image";
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
        attributes: ["id", "teamName", "tricode"],
        raw: true,
      });
      const blueTeam = teams.find((team) => team.id === blueTeamId);
      const redTeam = teams.find((team) => team.id === redTeamId);
      const winningTeam = teams.find((team) => team.id === winningTeamId);
      const losingTeam = teams.find(
        (team) =>
          team.id !== winningTeamId &&
          (team.id === blueTeamId || team.id === redTeamId)
      );

      return {
        ...round,
        blueTeamName: blueTeam.teamName,
        blueTeamTricode: blueTeam.tricode,
        redTeamName: redTeam.teamName,
        redTeamTricode: redTeam.tricode,
        winningTeamName: winningTeam.teamName,
        losingTeamName: losingTeam.teamName,
        losingTeamTricode: losingTeam.tricode,
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
  console.log(matchRounds);
  return (
    <MatchContainer matchId={match.id}>
      <section className="teams flex w-screen justify-center bg-black text-white text-lg items-center h-16 border-b-gray-300 border-b-1">
        <div className="team flex items-center p-3">
          <span className="tricode text-left font-semibold px-2">
            {matchRounds[0].blueTeamTricode}
          </span>
          <Image
            src={`/teams/${matchRounds[0].blueTeamTricode}.png`}
            alt="Team Logo"
            width="36"
            height="36"
          />
        </div>
        <span className="separator px-2 text-sm text-gray-400 font-semibold">
          VS
        </span>
        <div className="team flex items-center p-3">
          <Image
            src={`/teams/${matchRounds[0].redTeamTricode}.png`}
            alt="Team Logo"
            width="36"
            height="36"
            className="px-2"
          />
          <span className="tricode text-right font-semibold px-2">
            {matchRounds[0].redTeamTricode}
          </span>
        </div>
      </section>
      <section className="game-selector flex w-screen justify-center bg-[#0a0e13] text-white text-md items-center h-12 border-b-gray-300 border-b-1">
        <span className="label text-[#8fa3b0] font-semibold pr-8">GAME</span>
        <a
          href="#"
          className="px-8 text-[#00c8c8] active pointer-events-none font-semibold"
        >
          1
        </a>
        <a href="#" className="px-8 text-[#687077] font-semibold">
          2
        </a>
        <a href="#" className="px-8 text-[#687077] font-semibold">
          3
        </a>
      </section>
      <section className="stats-header flex w-screen justify-left bg-black text-white items-center h-16 border-b-gray-300 border-b-1">
        <ul className="menu list-none	pt-1 px-2 h-full">
          <li
            className="tab title stats selected tracking-widest p-4 font-medium text-sm border-b-4 border-b-[#00c8c8] h-full grid place-items-center"
            role="button"
          >
            STATS
          </li>
        </ul>
      </section>
      <section className="team-stats pt-4 pb-0 pr-4 pl-4 w-screen bg-[#0a0e13] text-white text-md items-center border-b-gray-300 border-b-1">
        <div className="dragons flex mb-4">
          <span className="blue-team flex-1"></span>
          <span className="label text-center flex-1 text-[#8fa3b0] tracking-widest font-semibold text-sm">
            DRAGONS
          </span>
          <span className="red-team flex-1"></span>
        </div>
        <div className="gold">
          <div className="bar flex">
            <div className="blue-team flex-1 mr-1 border-b-4 border-b-[#1580b6]"></div>
            <div className="red-team flex-1 ml-1 border-b-4 border-b-[#de2f2f]"></div>
          </div>
          <div className="totals flex mt-2 font-semibold text-lg">
            <div className="blue-team flex-1">2.5 K</div>
            <div className="title text-center flex-1 text-[#8fa3b0] tracking-widest font-semibold text-sm">
              GOLD
            </div>
            <div className="red-team flex-1 text-right">2.5 K</div>
          </div>
        </div>
        <div className="details flex">
          <div className="blue-team flex-1 flex justify-between pt-4 pb-0 pr-4 pl-4 mt-4 border-r border-r-[#252c32]">
            <div className="stat inhibitors inline-block text-center text-lg font-medium w-6 h-12">
              <svg
                className="icon"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                xmlns="https://www.w3.org/2000/svg"
              >
                <path
                  className="shape fill-[#4c7184]"
                  fill="#555d64"
                  d="M12,2 C17.522,2 22,6.478 22,12 C22,17.522 17.522,22 12,22 C6.477,22 2,17.522 2,12 C2,6.478 6.477,2 12,2 Z M12,4 C7.639,4 4,7.635 4,12 C4,16.365 7.639,20 12,20 C16.362,20 20,16.365 20,12 C20,7.635 16.362,4 12,4 Z M12,8 L16,12 L12,16 L8,12 L12,8 Z"
                ></path>
              </svg>
              0
            </div>
            <div className="stat barons inline-block text-center text-lg font-medium w-6 h-12">
              <svg
                className="icon"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                xmlns="https://www.w3.org/2000/svg"
              >
                <path
                  className="shape fill-[#4c7184]"
                  fill="#555d64"
                  d="M17,12.5049 C17,13.3299 16.331,13.9999 15.504,13.9999 L15.496,13.9999 C14.669,13.9999 14,13.3299 14,12.5049 L14,12.4949 C14,11.6699 14.669,10.9999 15.496,10.9999 L15.504,10.9999 C16.331,10.9999 17,11.6699 17,12.4949 L17,12.5049 Z M13,10.0079 C13,10.5559 12.556,10.9999 12.008,10.9999 L11.992,10.9999 C11.444,10.9999 11,10.5559 11,10.0079 L11,9.9919 C11,9.4439 11.444,8.9999 11.992,8.9999 L12.008,8.9999 C12.556,8.9999 13,9.4439 13,9.9919 L13,10.0079 Z M13,15.0099 C13,15.5569 12.557,15.9999 12.01,15.9999 L11.99,15.9999 C11.443,15.9999 11,15.5569 11,15.0099 L11,14.9899 C11,14.4429 11.443,13.9999 11.99,13.9999 L12.01,13.9999 C12.557,13.9999 13,14.4429 13,14.9899 L13,15.0099 Z M10,12.5139 C10,13.3349 9.334,13.9999 8.514,13.9999 L8.486,13.9999 C7.666,13.9999 7,13.3349 7,12.5139 L7,12.4859 C7,11.6659 7.666,10.9999 8.486,10.9999 L8.514,10.9999 C9.334,10.9999 10,11.6659 10,12.4859 L10,12.5139 Z M22,5.9999 L15,1.9999 L15,3.9999 L18,6.9999 L16,8.9999 L12,4.9999 L8,8.9999 L6,6.9999 L9,3.9999 L9,1.9999 L2,5.9999 L6,10.9999 L2,14.9999 L5,18.9999 L5,14.9999 L7,14.9999 L8,19.9999 L10,21.9999 L10,17.9999 L12,19.9999 L14,17.9999 L14,21.9999 L16,19.9999 L17,14.9999 L19,14.9999 L19,18.9999 L22,14.9999 L18,10.9999 L22,5.9999 Z"
                ></path>
              </svg>
              0
            </div>
            <div className="stat towers inline-block text-center text-lg font-medium w-6 h-12">
              <svg
                className="icon"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                xmlns="https://www.w3.org/2000/svg"
              >
                <path
                  className="shape fill-[#4c7184]"
                  fill="#555d64"
                  d="M9.0004,1.0004 L9.0004,5.9994 L6.9994,5.0004 L4.0004,6.9994 L4.9994,11.0004 L12.0004,14.9994 L19.0004,11.0004 L20.0004,6.9994 L16.9994,5.0004 L14.9994,5.9994 L14.9994,1.0004 L9.0004,1.0004 Z M11.0004,5.9994 L11.0004,3.0004 L13.0004,3.0004 L13.0004,5.9994 L12.0004,6.9994 L11.0004,5.9994 Z M15.9994,8.9994 L12.0004,12.0004 L7.9994,8.9994 L12.0004,10.0004 L15.9994,8.9994 Z M12.0001,16.9997 L16.0001,14.9997 L15.0001,21.0007 L16.9991,21.0007 L16.9991,22.9997 L7.0001,22.9997 L7.0001,21.0007 L9.0001,21.0007 L7.9991,14.9997 L12.0001,16.9997 Z"
                ></path>
              </svg>
              0
            </div>
            <div className="stat kills inline-block text-center text-lg font-medium w-6 h-12">
              <svg
                className="icon"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                xmlns="https://www.w3.org/2000/svg"
              >
                <path
                  className="shape fill-[#4c7184]"
                  fill="#555d64"
                  d="M16,3 L9.001,12 L9.001,13.5 L6,10.5 L5,14 L6.501,15.5 L3,19 L3,21 L5,21 L8.5,17.5 L10.001,19 L13.501,18 L10.5,15 L12,15 L21,8 L21,3 L16,3 Z M10.5,12.75 L17.001,6 L18.001,6 L18.001,7 L11.251,13.5 L10.5,13.5 L10.5,12.75 Z"
                ></path>
              </svg>
              0
            </div>
          </div>
          <div className="red-team flex-1 flex justify-between pt-4 pb-0 pr-4 pl-4 mt-4 border-l border-l-[#252c32]">
            <div className="stat inhibitors inline-block text-center text-lg font-medium w-6 h-12">
              <svg
                className="icon"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                xmlns="https://www.w3.org/2000/svg"
              >
                <path
                  className="shape fill-[#844c4c]"
                  fill="#555d64"
                  d="M12,2 C17.522,2 22,6.478 22,12 C22,17.522 17.522,22 12,22 C6.477,22 2,17.522 2,12 C2,6.478 6.477,2 12,2 Z M12,4 C7.639,4 4,7.635 4,12 C4,16.365 7.639,20 12,20 C16.362,20 20,16.365 20,12 C20,7.635 16.362,4 12,4 Z M12,8 L16,12 L12,16 L8,12 L12,8 Z"
                ></path>
              </svg>
              0
            </div>
            <div className="stat barons inline-block text-center text-lg font-bold w-6 h-12">
              <svg
                className="icon"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                xmlns="https://www.w3.org/2000/svg"
              >
                <path
                  className="shape fill-[#844c4c]"
                  fill="#555d64"
                  d="M17,12.5049 C17,13.3299 16.331,13.9999 15.504,13.9999 L15.496,13.9999 C14.669,13.9999 14,13.3299 14,12.5049 L14,12.4949 C14,11.6699 14.669,10.9999 15.496,10.9999 L15.504,10.9999 C16.331,10.9999 17,11.6699 17,12.4949 L17,12.5049 Z M13,10.0079 C13,10.5559 12.556,10.9999 12.008,10.9999 L11.992,10.9999 C11.444,10.9999 11,10.5559 11,10.0079 L11,9.9919 C11,9.4439 11.444,8.9999 11.992,8.9999 L12.008,8.9999 C12.556,8.9999 13,9.4439 13,9.9919 L13,10.0079 Z M13,15.0099 C13,15.5569 12.557,15.9999 12.01,15.9999 L11.99,15.9999 C11.443,15.9999 11,15.5569 11,15.0099 L11,14.9899 C11,14.4429 11.443,13.9999 11.99,13.9999 L12.01,13.9999 C12.557,13.9999 13,14.4429 13,14.9899 L13,15.0099 Z M10,12.5139 C10,13.3349 9.334,13.9999 8.514,13.9999 L8.486,13.9999 C7.666,13.9999 7,13.3349 7,12.5139 L7,12.4859 C7,11.6659 7.666,10.9999 8.486,10.9999 L8.514,10.9999 C9.334,10.9999 10,11.6659 10,12.4859 L10,12.5139 Z M22,5.9999 L15,1.9999 L15,3.9999 L18,6.9999 L16,8.9999 L12,4.9999 L8,8.9999 L6,6.9999 L9,3.9999 L9,1.9999 L2,5.9999 L6,10.9999 L2,14.9999 L5,18.9999 L5,14.9999 L7,14.9999 L8,19.9999 L10,21.9999 L10,17.9999 L12,19.9999 L14,17.9999 L14,21.9999 L16,19.9999 L17,14.9999 L19,14.9999 L19,18.9999 L22,14.9999 L18,10.9999 L22,5.9999 Z"
                ></path>
              </svg>
              0
            </div>
            <div className="stat towers inline-block text-center text-lg font-bold w-6 h-12">
              <svg
                className="icon"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                xmlns="https://www.w3.org/2000/svg"
              >
                <path
                  className="shape fill-[#844c4c]"
                  fill="#555d64"
                  d="M9.0004,1.0004 L9.0004,5.9994 L6.9994,5.0004 L4.0004,6.9994 L4.9994,11.0004 L12.0004,14.9994 L19.0004,11.0004 L20.0004,6.9994 L16.9994,5.0004 L14.9994,5.9994 L14.9994,1.0004 L9.0004,1.0004 Z M11.0004,5.9994 L11.0004,3.0004 L13.0004,3.0004 L13.0004,5.9994 L12.0004,6.9994 L11.0004,5.9994 Z M15.9994,8.9994 L12.0004,12.0004 L7.9994,8.9994 L12.0004,10.0004 L15.9994,8.9994 Z M12.0001,16.9997 L16.0001,14.9997 L15.0001,21.0007 L16.9991,21.0007 L16.9991,22.9997 L7.0001,22.9997 L7.0001,21.0007 L9.0001,21.0007 L7.9991,14.9997 L12.0001,16.9997 Z"
                ></path>
              </svg>
              0
            </div>
            <div className="stat kills inline-block text-center text-lg font-bold w-6 h-12">
              <svg
                className="icon"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                xmlns="https://www.w3.org/2000/svg"
              >
                <path
                  className="shape fill-[#844c4c]"
                  fill="#555d64"
                  d="M16,3 L9.001,12 L9.001,13.5 L6,10.5 L5,14 L6.501,15.5 L3,19 L3,21 L5,21 L8.5,17.5 L10.001,19 L13.501,18 L10.5,15 L12,15 L21,8 L21,3 L16,3 Z M10.5,12.75 L17.001,6 L18.001,6 L18.001,7 L11.251,13.5 L10.5,13.5 L10.5,12.75 Z"
                ></path>
              </svg>
              0
            </div>
          </div>
        </div>
      </section>
      <ul>
        {/* {matchRounds.map((round) => (
          <div key={round.id}>
            <p>Round Id: {round.id}</p>
            <p>Tournament Code: {round.tournamentCode}</p>
            <p>Winning team: {round.winningTeamName}</p>
            <p>Losing team: {round.losingTeamName}</p>
          </div>
        ))} */}
      </ul>
      <h2>Match Results</h2>
      {/* <div className="flex w-1/2 justify-between">
        {matchRoundTeamStats.map((gameResults, i) => {
          return gameResults.map((teamStats, j) => (
            <TeamResults key={j} teamStats={teamStats} />
          ));
        })}
      </div> */}
    </MatchContainer>
  );
}
