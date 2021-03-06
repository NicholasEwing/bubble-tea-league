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

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const sequelize = require("../../../sequelize");
const { MatchRound, Player, MatchRoundTeamStats, MatchRoundPlayerStats } =
  sequelize.models;
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
        const { metaData, gameId, winningTeam, losingTeam } = req.body;
        const { MatchId, riotAuth } = JSON.parse(metaData);

        // make sure Riot callback includes our API key
        if (riotAuth !== process.env.BTL_API_KEY) {
          res
            .status(401)
            .send("You are not authorized to send results to the BTL API.");
        }

        // reach out to Riot Games API for all stats
        let matchRoundResults = await v5getMatch(gameId);

        // parse useful info
        const teamIds = await findTeamIdsFromMatchResults(req.body);
        const { winningTeamId, losingTeamId } = teamIds;
        const winningPlayers = await Player.findAll({
          where: {
            TeamId: winningTeamId,
          },
          raw: true,
        });
        const losingPlayers = await Player.findAll({
          where: {
            TeamId: losingTeamId,
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

        // get blue / red team id
        const bluePlayerTeam = await Player.findOne({
          where: { PUUID: firstBluePlayerPUUID },
          attributes: ["TeamId"],
          raw: true,
        });
        const redPlayerTeam = await Player.findOne({
          where: { PUUID: firstRedPlayerPUUID },
          attributes: ["TeamId"],
          raw: true,
        });

        const blueTeamId = bluePlayerTeam.TeamId;
        const redTeamId = redPlayerTeam.TeamId;

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
            winningTeamID: {
              [Op.is]: null,
            },
            gameId: {
              [Op.eq]: null,
            },
          },
        });

        const matchRound = await emptyMatchRound.update(matchRoundObj);
        const MatchRoundId = matchRound.dataValues.id;

        // // Create 2 MatchRoundTeamStats records
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
          losingTeamId
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
