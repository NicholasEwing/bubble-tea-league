import { Op } from "sequelize";
import {
  parsePlayerStats,
  parseTeamStats,
} from "../../../lib/general-api-helpers";
import { replaceFakePlayerInfo } from "../../../lib/jest-api-helpers";
import {
  findTeamIdsFromMatchResults,
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

        const { matchResults } = req.body;
        // make sure Riot callback includes our API key
        const { metaData, gameId, winningTeam, losingTeam } = matchResults;
        const { MatchId, riotAuth } = JSON.parse(metaData);

        if (riotAuth !== process.env.BTL_API_KEY) {
          res
            .status(401)
            .send("You are not authorized to send results to the BTL API.");
        }

        const teamIds = await findTeamIdsFromMatchResults(matchResults);
        const { winningTeamId, losingTeamId } = teamIds;

        const matchRoundObj = {
          gameId,
          winningTeamId,
          losingTeamId,
          metaData,
          MatchId,
        };

        // Update a MatchRound record with the winner / losers
        const emptyMatchRound = await MatchRound.findOne({
          raw: false,
          where: {
            MatchId,
            winningTeamID: {
              [Op.is]: null,
            },
            losingTeamId: {
              [Op.is]: null,
            },
            gameId: {
              [Op.eq]: null,
            },
          },
        });
        const matchRound = await emptyMatchRound.update(matchRoundObj);
        const MatchRoundId = matchRound.dataValues.id;

        const winningPlayers = await Player.findAll({
          where: {
            TeamId: winningTeamId,
          },
        });

        const losingPlayers = await Player.findAll({
          where: {
            TeamId: losingTeamId,
          },
        });

        // reach out to Riot Games API for more stats
        let matchRoundResults = await v5getMatch(gameId);

        if (process.env.NODE_ENV === "test") {
          // when testing, we're just getting a random match and replacing
          // summonerNames / PUUIDs so it looks like a real tournament
          // game took place
          matchRoundResults = await replaceFakePlayerInfo(
            matchRoundResults,
            winningPlayers,
            losingPlayers
          );
        }

        // Create 2 MatchRoundTeamStats records
        const matchRoundTeamStatsRecords = await parseTeamStats(
          matchRoundResults,
          winningTeamId,
          losingTeamId,
          MatchRoundId
        );
        await MatchRoundTeamStats.bulkCreate(matchRoundTeamStatsRecords);

        // Create 10 MatchRoundPlayerStats records
        const allPlayers = [...winningPlayers, ...losingPlayers];
        const matchRoundPlayerStatsRecords = await parsePlayerStats(
          allPlayers,
          MatchRoundId,
          matchRoundResults
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
