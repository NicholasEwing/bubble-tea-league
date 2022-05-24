import { getPlayerPUUID } from "../../../lib/riot-games-api-helpers";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const sequelize = require("../../../sequelize");
const { Player } = sequelize.models;

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "POST":
        // find player PUUID from summoner name
        const PUUID = await getPlayerPUUID(req.body.summonerName);
        req.body.PUUID = PUUID;
        res.status(201).end();
        break;
      case "GET":
        const players = await Player.findAll();
        res.status(200).json(players);
        break;
      case "UPDATE":
        //TODO: update player with set() and save() and TEST IT
        // await Player.create(req.body);
        // res.status(201).end();
        break;
    }
  } catch (error) {
    console.error("Error inside /api/players", error);
  }
}
