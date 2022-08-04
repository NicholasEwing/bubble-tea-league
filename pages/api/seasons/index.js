import {
  createGroupStageMatches,
  createPlayoffsMatches,
} from "../../../lib/general-api-helpers";
import {
  createTournamentId,
  generateTournamentCodes,
} from "../../../lib/riot-games-api-helpers";
const sequelize = require("../../../sequelize");
const { Match, MatchRound, Season, Provider } = sequelize.models;

export default async function handler(req, res) {
  const seasons = await Season.findAll();

  switch (req.method) {
    case "GET":
      res.status(200).json(seasons);
      break;
    case "POST":
      try {
        const { name, year, number } = req.body;
        // Ensure we have only one provider record
        const providers = await Provider.findAll();

        if (!providers.length === 1)
          throw new Error(
            "No providers registered. Please register a provider before creating a Season."
          );
        const { providerId } = providers[0];

        // Hit Riot Games API to create a "tournament" for the Season
        const tournamentId = await createTournamentId(providerId, name);

        let season;
        if (req.body?.number) {
          season = await Season.create({
            number,
            tournamentId,
            year: year || new Date().getFullYear(),
          });
        } else {
          season = await Season.create({
            tournamentId,
            year: year || new Date().getFullYear(),
          });
        }

        // make 45 group stage matches / match rounds
        await createGroupStageMatches(season.number, tournamentId);

        // make 14 playoff matches / 42 match rounds
        await createPlayoffsMatches(season.number, tournamentId);

        res.status(201).send({ tournamentId });
      } catch (error) {
        let message;

        if (error?.parent?.sqlMessage) {
          message = error.parent.sqlMessage;
        } else {
          message = error.message;
        }

        res.status(424).send({ message });
      }
      break;
    case "PATCH":
      try {
        const { seasons } = req.body;
        await Season.bulkCreate(seasons, {
          updateOnDuplicate: ["year"],
        });
        res.status(200).send();
      } catch (error) {
        // console.log(error);
        res.status(500).send({ error });
      }
      break;
  }
}
