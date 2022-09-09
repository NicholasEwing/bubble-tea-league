import {
  parsePlayerStats,
  parseTeamStats,
} from "../../../lib/general-api-helpers";
import { replaceFakePlayerInfo } from "../../../lib/jest-api-helpers";
import {
  findTeamIdsFromMatchResults,
  getTimelineEvents,
  v5getMatch,
} from "../../../lib/riot-games-api-helpers";
import { seedPlayoffs } from "../../../lib/general-api-helpers";
import { sortStandings } from "../../../lib/utils";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import admins from "../../../admins";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { prisma } = require("../../../prisma/db");

export default async function handler(req, res) {
  try {
    if (process.env.NODE_ENV === "production") {
      const session = await unstable_getServerSession(req, res, authOptions);
      const userIsAdmin = admins.includes(session?.user?.email);
      if (!userIsAdmin) res.status(401).end();
    }
    switch (req.method) {
      case "POST":
        // where a lot of the magic happens
        await prisma.$transaction(async (prisma) => {
          try {
            const { metaData, gameId, winningTeam, losingTeam, shortCode } =
              req.body;
            let riotAuth;
            if (process.env.NODE_ENV === "production")
              riotAuth = JSON.parse(metaData).riotAuth;

            const { matchId } = await prisma.matchRound.findUniqueOrThrow({
              where: {
                tournamentCode: shortCode,
              },
              select: {
                matchId: true,
              },
            });

            // find season # from Match table
            const { seasonId } = await prisma.match.findUniqueOrThrow({
              where: {
                id: matchId,
              },
              select: {
                seasonId: true,
              },
            });

            // make sure Riot callback includes our API key
            if (
              process.env.NODE_ENV === "production" &&
              riotAuth !== process.env.BTL_API_KEY
            ) {
              res
                .status(401)
                .send("You are not authorized to send results to the BTL API.");
            }

            // reach out to Riot Games API for all stats
            let matchRoundResults = await v5getMatch(gameId);

            // parse useful info
            const winningPlayers = await prisma.player.findMany({
              where: {
                summonerName: {
                  in: winningTeam.map((p) => p.summonerName),
                },
              },
              select: {
                id: true,
                PUUID: true,
                summonerName: true,
              },
            });
            const losingPlayers = await prisma.player.findMany({
              where: {
                summonerName: {
                  in: losingTeam.map((p) => p.summonerName),
                },
              },
              select: {
                id: true,
                PUUID: true,
                summonerName: true,
              },
            });
            const teamIds = await findTeamIdsFromMatchResults(
              req.body,
              seasonId,
              winningPlayers,
              losingPlayers
            );
            const { winningTeamId, losingTeamId } = teamIds;

            // Get timeline events
            let timelineEvents = await getTimelineEvents(gameId);

            // mutate matchRoundResults to use correct PUUIDs when testing
            // mutate timelineResults to use correct PUUIDs when testing
            if (
              process.env.NODE_ENV === "test" ||
              process.env.NODE_ENV === "development"
            ) {
              [matchRoundResults, timelineEvents] = await replaceFakePlayerInfo(
                matchRoundResults,
                timelineEvents,
                winningPlayers,
                losingPlayers
              );
            }

            // get player puuids
            const bluePlayers = matchRoundResults.info.participants.filter(
              (participant) => {
                return participant.teamId === 100;
              }
            );

            const redPlayers = matchRoundResults.info.participants.filter(
              (participant) => {
                return participant.teamId === 200;
              }
            );

            // we know the winning / losing team Ids, now we need to know
            // which color side they were on
            let blueTeamId;
            for (const player of bluePlayers) {
              if (player.puuid) {
                const { playerTeamHistories: bluePlayerHistories } =
                  await prisma.player.findUnique({
                    where: {
                      PUUID: player.puuid,
                    },
                    include: {
                      playerTeamHistories: {
                        where: {
                          teamId: {
                            in: [winningTeamId, losingTeamId],
                          },
                        },
                        select: {
                          teamId: true,
                        },
                      },
                    },
                  });
                const { teamId } = bluePlayerHistories[0];
                if (teamId) {
                  blueTeamId = teamId;
                  break;
                }
              }
            }

            let redTeamId;
            for (const player of redPlayers) {
              const { playerTeamHistories: redPlayerHistories } =
                await prisma.player.findUnique({
                  where: {
                    PUUID: player.puuid,
                  },
                  include: {
                    playerTeamHistories: {
                      where: {
                        teamId: {
                          in: [winningTeamId, losingTeamId],
                        },
                      },
                      select: {
                        teamId: true,
                      },
                    },
                  },
                });
              const { teamId } = redPlayerHistories[0];

              if (teamId) {
                redTeamId = teamId;
                break;
              }
            }

            // get game length
            const gameDuration = matchRoundResults.info.gameDuration;

            const matchRoundObj = {
              gameId: gameId.toString(),
              metaData,
              gameDuration,
              matchId,
              winningTeamId,
              redTeamId,
              blueTeamId,
            };

            // Update a matchRound record with the winner
            console.log("match id?", matchId);
            const { id: emptyMatchRoundId } =
              await prisma.matchRound.findFirstOrThrow({
                where: {
                  matchId,
                  winningTeamId: null,
                  gameId: null,
                },
                select: {
                  id: true,
                },
              });

            const { id: matchRoundId } = await prisma.matchRound.update({
              where: {
                id: emptyMatchRoundId,
              },
              data: matchRoundObj,
              select: {
                id: true,
              },
            });

            // track actual match winner
            const match = await prisma.match.findUniqueOrThrow({
              where: {
                id: matchId,
              },
            });

            let seasonTeams;
            if (match.isPlayoffsMatch) {
              // add metadata info on teams if this is our first time seeing it
              if (!match.blueTeamId && !match.redTeamId) {
                await prisma.match.update({
                  where: {
                    id: matchId,
                  },
                  data: {
                    teamOneId: blueTeamId,
                    teamTwoId: redTeamId,
                  },
                });
              }

              const playoffsMatches = await prisma.matchRound.findMany({
                where: {
                  matchId,
                  winningTeamId: {
                    not: null,
                  },
                },
              });

              if (playoffsMatches.length > 1) {
                // Playoffs Logic
                const { redTeamId, blueTeamId } = playoffsMatches[0];
                const teamIds = [redTeamId, blueTeamId];

                const matchWinner = teamIds.find((teamId) => {
                  const teamIdWins = playoffsMatches.filter(
                    (m) => m.winningTeamId == teamId
                  );

                  if (teamIdWins.length === 2) {
                    return teamId;
                  } else {
                    return false;
                  }
                });

                if (matchWinner) {
                  await prisma.match.update({
                    where: {
                      id: matchId,
                    },
                    data: {
                      matchWinnerTeamId: winningTeamId,
                      matchLoserTeamId: losingTeamId,
                    },
                  });

                  // advance players in playoffs bracket
                  if (match.isUpperBracket && match.bracketRound < 3) {
                    // advance winner
                    const nextWinnerMatch = await prisma.match.findFirstOrThrow(
                      {
                        where: {
                          seasonId,
                          isUpperBracket: true,
                          bracketRound: match.bracketRound + 1,
                        },
                      }
                    );
                    if (nextWinnerMatch.teamOne) {
                      await prisma.match.update({
                        where: {
                          id: nextWinnerMatch.id,
                        },
                        data: {
                          teamTwoId: winningTeamId,
                        },
                      });
                    } else {
                      await prisma.match.update({
                        where: {
                          id: nextWinnerMatch.id,
                        },
                        data: {
                          teamOneId: winningTeamId,
                        },
                      });
                    }

                    // advance loser to lower bracket
                    await prisma.match.update({
                      where: {
                        seasonId,
                        isUpperBracket: false,
                        bracketRound: match.bracketRound + 1,
                      },
                      data: {
                        teamOneId: losingTeamId,
                      },
                    });
                  } else {
                    // if semifinals...
                    if (match.bracketRound === 5) {
                      // ...move to finals
                      await prisma.match.update({
                        where: {
                          seasonId,
                          isUpperBracket: true,
                          bracketRound: 4,
                        },
                        data: {
                          teamTwoId: winningTeamId,
                        },
                      });
                    } else {
                      // otherwise, move up the lower bracket
                      await prisma.match.update({
                        where: {
                          seasonId,
                          isUpperBracket: false,
                          bracketRound: match.bracketRound + 1,
                        },
                        data: {
                          teamTwoId: winningTeamId,
                        },
                      });
                    }
                  }
                }
              }
            } else {
              // Group Stage Logic
              await prisma.match.update({
                where: {
                  id: matchId,
                },
                data: {
                  matchWinnerTeamId: winningTeamId,
                  matchLoserTeamId: losingTeamId,
                },
              });

              // Recalculate team standings
              seasonTeams = await prisma.team.findMany({
                where: {
                  seasonId,
                },
              });

              const groupStageMatches = await prisma.match.findMany({
                where: {
                  seasonId,
                  isPlayoffsMatch: false,
                },
              });
              const groupStageMatchRounds = await prisma.match.findMany({
                where: {
                  seasonId,
                  isPlayoffsMatch: false,
                },
              });

              seasonTeams = seasonTeams.map((team) => {
                const groupStageWins = groupStageMatches.filter(
                  (m) => m.matchWinnerTeamId === team.id
                );
                const groupStageLosses = groupStageMatches.filter(
                  (m) => m.matchLoserTeamId === team.id
                );
                return { ...team, groupStageWins, groupStageLosses };
              });

              seasonTeams = await sortStandings(
                seasonTeams,
                groupStageMatches,
                groupStageMatchRounds
              );

              const teamStandingRecords = seasonTeams.map((team, i) => {
                return { teamId: team.id, placement: i + 1 };
              });

              const seasonTeamStandings = await prisma.teamStanding.findMany({
                where: {
                  teamId: {
                    in: seasonTeams.map((t) => t.id), // filtering by teams = filtering by season basically
                  },
                },
              });

              for (const standing of seasonTeamStandings) {
                const { placement } = teamStandingRecords.find(
                  (r) => r.teamId === standing.teamId
                );

                await prisma.teamStanding.update({
                  where: {
                    id: standing.id,
                  },
                  data: {
                    placement,
                  },
                });
              }

              // if last (45th) group stage match for the season, seed playoffs
              const finishedGroupStageMatches = await prisma.match.findMany({
                where: {
                  seasonId,
                  matchWinnerTeamId: {
                    not: null,
                  },
                  matchLoserTeamId: {
                    not: null,
                  },
                  isPlayoffsMatch: false,
                },
              });

              if (finishedGroupStageMatches.length === 45) {
                await seedPlayoffs(seasonId, seasonTeams);
              }
            }

            // Create 2 MatchRoundTeamStats records
            const matchRoundTeamStatsRecords = await parseTeamStats(
              matchRoundResults,
              winningTeamId,
              losingTeamId,
              matchRoundId
            );
            await prisma.matchRoundTeamStats.createMany({
              data: matchRoundTeamStatsRecords,
            });

            // // Create 10 MatchRoundPlayerStats records
            const allPlayers = [...winningPlayers, ...losingPlayers];
            const matchRoundPlayerStatsRecords = await parsePlayerStats(
              allPlayers,
              matchRoundId,
              matchRoundResults,
              blueTeamId,
              redTeamId,
              matchRoundTeamStatsRecords,
              timelineEvents,
              winningTeamId,
              losingTeamId,
              seasonId,
              seasonTeams
            );
            await prisma.matchRoundPlayerStats.createMany({
              data: matchRoundPlayerStatsRecords,
            });
            res.status(201).end();
          } catch (error) {
            console.log(error);
            res.status(424).send(error.message);
          }
        });
        break;
    }
  } catch (error) {
    console.error("Error inside /api/match-rounds", error);
    res.status(404).send(error.message);
  }
}
