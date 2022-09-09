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
        const tournamentId = await createTournamentId(
          providerId,
          "Bubble Tea League"
        );

        await prisma.$transaction(async (prisma) => {
          // Create season
          const season = await prisma.season.create({
            data: {
              tournamentId,
              year: parseInt(year),
            },
          });
          const seasonId = season.id;

          // Create new placeholder teams with random info
          const newTeams = createTeams(10, season.id);
          await prisma.team.createMany({ data: newTeams });
          const teams = await prisma.team.findMany({
            where: {
              seasonId,
            },
          });

          // If this is the first season, then assign 50 random players to our 10 teams
          // otherwise our <EditableTable /> breaks in a million ways...
          const seasons = await prisma.season.findMany();
          if (seasons.length === 1) {
            const players = await prisma.player.findMany();
            const regularPlayers = players.filter((p) => !p.isFreeAgent);
            if (regularPlayers.length < 50)
              throw new Error(
                "Need 50 players (not free agents) in order to generate the first season."
              );

            // For every 5 players, assign them to a team
            let j = 0;
            const playerTeamHistoryObjs = regularPlayers.map((p, i) => {
              const team = teams[j];
              const iPlusOne = i + 1;
              if (i > 0 && iPlusOne % 5 === 0) j++;

              return {
                teamId: team.id,
                playerId: p.id,
              };
            });
            await prisma.playerTeamHistory.createMany({
              data: playerTeamHistoryObjs,
            });
          }

          // Create default team standing records
          await prisma.teamStanding.createMany({
            data: teams.map((t, i) => ({
              teamId: t.id,
              placement: i + 1,
            })),
          });

          // Create group stage match objects
          let scheduledTime = new Date(new Date().getFullYear() + 1, 0, 1); // set to Jan 1st of next year
          const groupStageMatchObjs = teams.reduce((matchObjs, team) => {
            const allMatchesForTeam = teams.map((comparedTeam) => {
              const comparingSameTeam = team.id === comparedTeam.id;

              const matchupAlreadyExists = matchObjs.some((match) => {
                return (
                  (match.teamOneId === team.id &&
                    match.teamTwoId === comparedTeam.id) ||
                  (match.teamOneId === comparedTeam.id &&
                    match.teamTwoId === team.id)
                );
              });

              if (comparingSameTeam || matchupAlreadyExists) return null;

              return {
                seasonId,
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

          // Create playoff matches objects
          const playoffsMatchObjs = [];
          for (let i = 0; i < 14; i++) {
            playoffsMatchObjs.push({
              seasonId,
              isPlayoffsMatch: true,
            });
          }
          // set to Jan 1st of next year + 46 days
          let playoffsScheduledTime = new Date(
            new Date().getFullYear() + 1,
            0,
            46
          ); // set to Jan 1st of next year + 46 days
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
            obj.scheduledTime = new Date(
              playoffsScheduledTime.setDate(playoffsScheduledTime.getDate() + 1)
            );
          }

          // Make group stage / playoffs matches in db
          await prisma.match.createMany({
            data: groupStageMatchObjs,
          });
          await prisma.match.createMany({
            data: playoffsMatchObjs,
          });
          const groupStageMatches = await prisma.match.findMany({
            where: {
              seasonId,
              isPlayoffsMatch: false,
            },
          });
          const playoffsMatches = await prisma.match.findMany({
            where: {
              seasonId,
              isPlayoffsMatch: true,
            },
            select: {
              id: true,
            },
          });
          const playoffsMatchesIds = playoffsMatches.map((m) => m.id);

          // Make all tournament codes
          const count =
            groupStageMatchObjs.length + playoffsMatchObjs.length * 3;
          const tournamentCodes = await generateTournamentCodes(
            tournamentId,
            count
          );

          // Create group stage match rounds
          const groupStageMatchRoundObjs = groupStageMatches.map((gsm, i) => {
            const { teamOneId, teamTwoId, id: matchId } = gsm;

            const redTeamId = Math.random() < 0.5 ? teamOneId : teamTwoId;
            const blueTeamId = redTeamId === teamOneId ? teamTwoId : teamOneId; // whichever team was NOT picked for the red team

            return {
              matchId,
              redTeamId,
              blueTeamId,
              tournamentCode: tournamentCodes[i],
            };
          });

          // Create playoffs match rounds
          let j = 0;
          let playoffsMatchRoundObjs = [];
          for (let i = 0; i < playoffsMatchObjs.length * 3; i++) {
            const tournyCodeIndex = i + 45;
            const iPlusOne = i + 1;
            const matchRound = {
              matchId: playoffsMatchesIds[j],
              tournamentCode: tournamentCodes[tournyCodeIndex],
            };
            if (i > 0 && iPlusOne % 3 === 0) {
              j++;
            }
            playoffsMatchRoundObjs.push(matchRound);
          }

          // Create group stage / playoffs match rounds in db
          await prisma.matchRound.createMany({
            data: groupStageMatchRoundObjs,
          });
          await prisma.matchRound.createMany({
            data: playoffsMatchRoundObjs,
          });
        });

        res.status(201).send({ tournamentId });
      } catch (error) {
        console.log("ERROR:", error);
        res.status(424).send({ message: error.message });
      }
      break;
    case "PATCH":
      try {
        const { seasons } = req.body;
        for (const season of seasons) {
          const { id, year } = season;
          await prisma.season.update({
            where: {
              id,
            },
            data: {
              year,
            },
          });
        }
        res.status(200).send();
      } catch (error) {
        res.status(500).send({ error });
      }
      break;
  }
}
