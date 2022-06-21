import { createTournamentId } from "../../../lib/riot-games-api-helpers";
const sequelize = require("../../../sequelize");
const { Season, Provider } = sequelize.models;

export default async function handler(req, res) {
  const seasons = await Season.findAll();

  switch (req.method) {
    case "GET":
      res.status(200).json(seasons);
      break;
    case "POST":
      const { name } = req.body;

      // Ensure we have only one provider record
      const providers = await Provider.findAll();

      if (!providers.length === 1)
        throw new Error(
          "No providers registered. Please register a provider before creating a Season."
        );
      const { providerId } = providers[0];

      // Hit Riot Games API to create a "tournament" for the Season
      const tournamentId = await createTournamentId(providerId, name);

      if (req.body?.number) {
        await Season.create({ number, tournamentId });
      } else {
        await Season.create({ tournamentId });
      }

      res.status(201).send({ tournamentId });

      break;
  }
}
