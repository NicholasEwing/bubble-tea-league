import { Op } from "sequelize";
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

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const sequelize = require("../../../sequelize");
const {
  Match,
  MatchRound,
  Player,
  MatchRoundTeamStats,
  MatchRoundPlayerStats,
  PlayerTeamHistory,
} = sequelize.models;
const { default: fetch } = require("node-fetch");

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "GET":
        const matchRounds = await MatchRound.findAll();
        res.status(200).json(matchRounds);
        break;
      case "POST":
        // where a lot of the magic happens
        const { metaData, gameId, winningTeam, losingTeam, shortCode } =
          req.body;
        const { riotAuth } = JSON.parse(metaData);

        const { MatchId } = await MatchRound.findOne({
          raw: true,
          where: {
            tournamentCode: shortCode,
          },
          attributes: ["MatchId"],
        });

        // find season # from Match table
        const { season } = await Match.findOne({
          raw: true,
          where: {
            id: MatchId,
          },
          attributes: ["season"],
        });

        // make sure Riot callback includes our API key
        if (riotAuth !== process.env.BTL_API_KEY) {
          res
            .status(401)
            .send("You are not authorized to send results to the BTL API.");
        }

        // reach out to Riot Games API for all stats
        let matchRoundResults = await v5getMatch(gameId);

        // parse useful info
        const teamIds = await findTeamIdsFromMatchResults(req.body, season);
        const { winningTeamId, losingTeamId } = teamIds;

        const winningNames = winningTeam.map((p) => p.summonerName);
        const losingNames = losingTeam.map((p) => p.summonerName);

        const winningPlayers = await Player.findAll({
          where: {
            summonerName: {
              [Op.in]: winningNames,
            },
          },
          raw: true,
        });

        const losingPlayers = await Player.findAll({
          where: {
            summonerName: {
              [Op.in]: losingNames,
            },
          },
          raw: true,
        });

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
        const firstBluePlayerPUUID = matchRoundResults.info.participants.find(
          (participant) => {
            return participant.teamId === 100;
          }
        ).puuid;

        const firstRedPlayerPUUID = matchRoundResults.info.participants.find(
          (participant) => {
            return participant.teamId === 200;
          }
        ).puuid;

        // we know the winning / losing team Ids, now we need to know
        // which color side they were on

        // get player ids for first red / blue players
        const { id: firstBluePlayerId } = await Player.findOne({
          where: {
            PUUID: firstBluePlayerPUUID,
          },
          attributes: ["id"],
          raw: true,
        });

        const { id: firstRedPlayerId } = await Player.findOne({
          where: {
            PUUID: firstRedPlayerPUUID,
          },
          attributes: ["id"],
          raw: true,
        });

        // now FINALLY find the blue / red player's team ids
        const { TeamId: blueTeamId } = await PlayerTeamHistory.findOne({
          where: { PlayerId: firstBluePlayerId },
          attributes: ["TeamId"],
          raw: true,
        });

        const { TeamId: redTeamId } = await PlayerTeamHistory.findOne({
          where: { PlayerId: firstRedPlayerId },
          attributes: ["TeamId"],
          raw: true,
        });

        // get game length
        const gameDuration = matchRoundResults.info.gameDuration;

        const matchRoundObj = {
          gameId,
          metaData,
          gameDuration,
          MatchId,
          winningTeamId,
          redTeamId,
          blueTeamId,
        };

        // Update a MatchRound record with the winner
        const emptyMatchRound = await MatchRound.findOne({
          raw: false,
          where: {
            MatchId,
            winningTeamId: {
              [Op.is]: null,
            },
            gameId: {
              [Op.eq]: null,
            },
          },
        });

        const matchRound = await emptyMatchRound.update(matchRoundObj);
        const MatchRoundId = matchRound.dataValues.id;

        // track actual match winner
        const match = await Match.findByPk(MatchId);

        if (match.isPlayoffsMatch) {
          // add metadata info on teams if this is our first time seeing it
          if (!match.blueTeamId && !match.redTeamId) {
            await match.update({
              teamOne: blueTeamId,
              teamTwo: redTeamId,
            });
          }

          const matchRounds = await MatchRound.findAll({ raw: true });

          const playoffsMatches = matchRounds.filter(
            (mr) => mr.MatchId === MatchId && mr.winningTeamId
          );

          if (playoffsMatches.length > 1) {
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
              await match.update({
                matchWinnerTeamId: winningTeamId,
                matchLoserTeamId: losingTeamId,
              });

              // advance players in playoffs bracket
              if (match.isUpperBracket && match.bracketRound < 3) {
                // advance winner
                const nextWinnerMatch = await Match.findOne({
                  where: {
                    season,
                    isUpperBracket: true,
                    bracketRound: match.bracketRound + 1,
                  },
                });
                if (nextWinnerMatch.teamOne) {
                  await nextWinnerMatch.update({ teamTwo: winningTeamId });
                } else {
                  await nextWinnerMatch.update({ teamOne: winningTeamId });
                }

                // advance loser to lower bracket
                const nextLoserMatch = await Match.findOne({
                  where: {
                    season,
                    isUpperBracket: false,
                    bracketRound: match.bracketRound + 1,
                  },
                });
                await nextLoserMatch.update({ teamOne: losingTeamId });
              } else {
                // if semifinals...
                if (match.bracketRound === 5) {
                  // ...move to finals
                  const finalsMatch = await Match.findOne({
                    where: {
                      season,
                      isUpperBracket: true,
                      bracketRound: 4,
                    },
                  });

                  finalsMatch.update({ teamTwo: winningTeamId });
                } else {
                  // otherwise, move up the lower bracket
                  const nextWinnerMatch = await Match.findOne({
                    where: {
                      season,
                      isUpperBracket: false,
                      bracketRound: match.bracketRound + 1,
                    },
                  });
                  nextWinnerMatch.update({ teamTwo: winningTeamId });
                }
              }
            }
          }
        } else {
          await match.update({
            matchWinnerTeamId: winningTeamId,
            matchLoserTeamId: losingTeamId,
          });

          // if last (45th) group stage match for the season, seed playoffs
          const finishedGroupStageMatches = await Match.findAll({
            raw: true,
            where: {
              season,
              matchWinnerTeamId: {
                [Op.not]: null,
              },
              matchLoserTeamId: {
                [Op.not]: null,
              },
            },
          });

          if (finishedGroupStageMatches.length === 45) {
            await seedPlayoffs(season);
          }
        }

        // Create 2 MatchRoundTeamStats records
        const matchRoundTeamStatsRecords = await parseTeamStats(
          matchRoundResults,
          winningTeamId,
          losingTeamId,
          MatchRoundId
        );
        await MatchRoundTeamStats.bulkCreate(matchRoundTeamStatsRecords);

        // // Create 10 MatchRoundPlayerStats records
        const allPlayers = [...winningPlayers, ...losingPlayers];
        const matchRoundPlayerStatsRecords = await parsePlayerStats(
          allPlayers,
          MatchRoundId,
          matchRoundResults,
          blueTeamId,
          redTeamId,
          matchRoundTeamStatsRecords,
          timelineEvents,
          winningTeamId,
          losingTeamId,
          season
        );
        await MatchRoundPlayerStats.bulkCreate(matchRoundPlayerStatsRecords);

        res.status(201).end();
        break;
      case "UPDATE":
        //TODO: update player with set() and save() and TEST IT
        // await Player.create(req.body);
        // res.status(201).end();
        break;
    }
  } catch (error) {
    console.error("Error inside /api/match-rounds", error);
    res.status(404).send(error.message);
  }
}
