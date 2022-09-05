import {
  createGroupStageMatches,
  createPlayoffsMatches,
  createTeams,
} from "../../../lib/general-api-helpers";
import {
  createTournamentId,
  generateTournamentCodes,
} from "../../../lib/riot-games-api-helpers";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import admins from "../../admin";

import { prisma } from "../../../prisma/db";

export default async function handler(req, res) {
  const seasons = await prisma.season.findMany();

  if (process.env.NODE_ENV === "production") {
    const session = await unstable_getServerSession(req, res, authOptions);
    const userIsAdmin = admins.includes(session?.user?.email);
    if (!userIsAdmin) res.status(401).end();
  }

  switch (req.method) {
    case "GET":
      res.status(200).json(seasons);
      break;
    case "POST":
      let season,
        groupStageMatches,
        groupStageMatchRounds,
        playoffsMatches,
        playoffsMatchRounds;

      try {
        const { year } = req.body;
        // Ensure we have only one provider record
        const providers = await prisma.provider.findMany();

        if (!providers.length === 1)
          throw new Error(
            "No providers registered. Please register a provider before creating a Season."
          );
        const { providerId } = providers[0];

        // Hit Riot Games API to create a "tournament" for the Season
        // const tournamentId = await createTournamentId(providerId, name);
        const tournamentId = 124;

        await prisma.$transaction(async (prisma) => {
          // Create season
          const season = await prisma.season.create({
            data: {
              tournamentId,
              year: parseInt(year),
            },
          });

          // Create new placeholder teams with random info
          const newTeams = createTeams(10, season.id);
          await prisma.team.createMany({ data: newTeams });
          const teams = await prisma.team.findMany({
            where: {
              seasonId: season.id,
            },
          });

          // Create default team standing records
          await prisma.teamStanding.createMany({
            data: teams.map((t, i) => ({
              teamId: t.id,
              placement: i + 1,
            })),
          });

          // Create Matches
          let scheduledTime = new Date(new Date().getFullYear() + 1, 0, 1); // set to Jan 1st of next year
          const matchObjs = teams.reduce((matchObjs, team) => {
            const allMatchesForTeam = teams.map((comparedTeam) => {
              const comparingSameTeam = team.id === comparedTeam.id;

              const matchupAlreadyExists = matchObjs.some((match) => {
                return (
                  (match.teamOne === team.id &&
                    match.teamTwo === comparedTeam.id) ||
                  (match.teamOne === comparedTeam.id &&
                    match.teamTwo === team.id)
                );
              });

              if (comparingSameTeam || matchupAlreadyExists) return null;

              return {
                seasonId: season.id,
                isPlayoffsMatch: false,
                teamOneId: team.id,
                teamTwoId: comparedTeam.id,
                scheduledTime: new Date(
                  scheduledTime.setDate(scheduledTime.getDate() + 1) // add one day
                ),
              };
            });

            return [...matchObjs, ...allMatchesForTeam.filter((m) => m)];
          }, []);
          await prisma.match.createMany({ data: matchObjs });
          const groupStageMatches = await prisma.match.findMany({
            where: {
              seasonId: season.id,
            },
          });
          const MatchIds = groupStageMatches.map((m) => m.id);

          // Create Match Rounds
          const bestOf = 1;
          const tournamentCodes = await generateTournamentCodes(
            bestOf,
            tournamentId,
            MatchIds,
            matchObjs.length
          );
          const matchRoundObjs = tournamentCodes.map((tournamentCode, i) => {
            // 50% chance to assign a team to red / blue
            const { teamOne, teamTwo, id: MatchId } = groupStageMatches[i];
            const redTeamId = Math.random() < 0.5 ? teamOne : teamTwo;
            const blueTeamId = redTeamId === teamOne ? teamTwo : teamOne; // whichever team was NOT picked for the red team;
            return {
              MatchId,
              tournamentCode,
              redTeamId,
              blueTeamId,
            };
          });
          const groupStageMatchRounds = await prisma.matchRound.createMany({
            data: matchRoundObjs,
          });

          // Create Playoff Matches
          const playoffsMatchObjs = [];
          for (let i = 0; i < 14; i++) {
            playoffsMatchObjs.push({
              seasonId: seasonNumber,
              isPlayoffsMatch: true,
            });
          }
          // set to Jan 1st of next year + 46 days
          let playoffsScheduledTime = new Date();
          new Date().getFullYear() + 1, 0, 46;
          // wrote a loop but it was annoying to
          // maintain so I'm just hardcoding 14 objects, sue me ¯\_(ツ)_/¯
          playoffsMatchObjs[0].isUpperBracket = true; // start upper bracket
          playoffsMatchObjs[1].isUpperBracket = true;
          playoffsMatchObjs[2].isUpperBracket = true;
          playoffsMatchObjs[3].isUpperBracket = true;
          playoffsMatchObjs[4].isUpperBracket = true;
          playoffsMatchObjs[5].isUpperBracket = true;
          playoffsMatchObjs[0].bracketRound = 1;
          playoffsMatchObjs[1].bracketRound = 1;
          playoffsMatchObjs[2].bracketRound = 2;
          playoffsMatchObjs[3].bracketRound = 2;
          playoffsMatchObjs[4].bracketRound = 3;
          playoffsMatchObjs[5].bracketRound = 4;
          playoffsMatchObjs[6].isUpperBracket = false; // start lower bracket
          playoffsMatchObjs[7].isUpperBracket = false;
          playoffsMatchObjs[8].isUpperBracket = false;
          playoffsMatchObjs[9].isUpperBracket = false;
          playoffsMatchObjs[10].isUpperBracket = false;
          playoffsMatchObjs[11].isUpperBracket = false;
          playoffsMatchObjs[12].isUpperBracket = false;
          playoffsMatchObjs[13].isUpperBracket = false;
          playoffsMatchObjs[6].bracketRound = 1;
          playoffsMatchObjs[7].bracketRound = 1;
          playoffsMatchObjs[8].bracketRound = 2;
          playoffsMatchObjs[9].bracketRound = 2;
          playoffsMatchObjs[10].bracketRound = 3;
          playoffsMatchObjs[11].bracketRound = 3;
          playoffsMatchObjs[12].bracketRound = 4;
          playoffsMatchObjs[13].bracketRound = 5;
          for (const obj of playoffsMatchObjs) {
            obj.scheduledTime = scheduledTime.setDate(
              scheduledTime.getDate() + 1
            );
          }
          const playoffsMatches = await prisma.match.createMany({
            data: playoffsMatchObjs,
          });

          // Create Playoff Match Rounds
          const playoffsBestOf = 3;
          const PlayoffsMatchIds = playoffsMatches.map((m) => m.id);
          const playoffTournamentCodes = await generateTournamentCodes(
            playoffsBestOf,
            tournamentId,
            PlayoffsMatchIds,
            playoffsMatches.length
          );
          let j = 0;
          const playoffMatchRoundObjs = tournamentCodes.map(
            (tournamentCode, i) => {
              const iPlusOne = i + 1;
              const obj = {
                MatchId: MatchIds[j],
                tournamentCode,
              };
              if (i > 0 && iPlusOne % 3 === 0) {
                j++;
              }
              return obj;
            }
          );
          const playoffsMatchRounds = await prisma.matchRound.createMany({
            data: playoffMatchRoundObjs,
          });
        });

        res.status(201).send({ tournamentId });
      } catch (error) {
        console.error(error);
        res.status(424).send({ message: error.message });
      }
      break;
    case "PATCH":
      try {
        const { seasons } = req.body;
        // await Season.bulkCreate(seasons, {
        //   updateOnDuplicate: ["year"],
        // });
        res.status(200).send();
      } catch (error) {
        res.status(500).send({ error });
      }
      break;
  }
}
