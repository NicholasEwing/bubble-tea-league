import { getPlayerPUUID } from "../../../lib/riot-games-api-helpers";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import admins from "../../../sequelize/admins";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const sequelize = require("../../../sequelize");
const { Player } = sequelize.models;

export default async function handler(req, res) {
  try {
    if (process.env.NODE_ENV === "production") {
      const session = await unstable_getServerSession(req, res, authOptions);
      const userIsAdmin = admins.includes(session?.user?.email);
      if (!userIsAdmin) res.status(401).end();
    }

    switch (req.method) {
      case "POST":
        try {
          // if no PUUID given...
          const { summonerName, discordName, firstName } = req.body;
          let { PUUID } = req.body;
          if (!PUUID) PUUID = await getPlayerPUUID(summonerName);
          const { id } = await Player.create({
            PUUID,
            summonerName,
            discordName,
            firstName,
          });
          res.status(201).send({ id });
        } catch (error) {
          let message;

          if (error?.parent?.sqlMessage) {
            message = error.parent.sqlMessage;
          } else {
            message = error.message;
          }

          res.status(409).send({ message });
        }
        break;
      case "GET":
        const players = await Player.findAll();
        res.status(200).json(players);
        break;
      case "PATCH":
        try {
          const { players } = req.body;
          await Player.bulkCreate(players, {
            updateOnDuplicate: [
              "summonerName",
              "firstName",
              "discordName",
              "role",
            ],
          });
          res.status(200).send();
        } catch (error) {
          res.status(500).send({ error });
        }
        break;
      case "DELETE":
        try {
          const { idsToDelete } = req.body;
          await Player.destroy({
            where: { id: idsToDelete },
          });
          res.status(200).send();
        } catch (error) {
          res.status(404).send({ error });
        }
        break;
    }
  } catch (error) {
    console.error("Error inside /api/players", error);
  }
}
