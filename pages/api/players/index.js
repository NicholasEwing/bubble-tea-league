import { getPlayerPUUID } from "../../../lib/riot-games-api-helpers";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { isValidEmail } from "../../../lib/utils";
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
        try {
          const { summonerName, discordName, firstName, email, isFreeAgent } =
            req.body;
          let { PUUID } = req.body;
          if (!PUUID) PUUID = await getPlayerPUUID(summonerName);
          await prisma.player.create({
            data: {
              PUUID,
              summonerName,
              discordName,
              firstName,
              isFreeAgent,
              email: isValidEmail(email) ? email : null,
            },
          });
          res.status(201).end();
        } catch (error) {
          res.status(409).json(error);
        }
        break;
      case "PATCH":
        try {
          const { players } = req.body;
          for (const player of players) {
            const { id, summonerName, firstName, discordName, role, email } =
              player;

            await prisma.player.update({
              where: {
                idz,
              },
              data: {
                summonerName,
                firstName,
                discordName,
                role,
                email,
              },
            });
          }
          res.status(200).end();
        } catch (error) {
          res.status(500).send({ message: "yoooo" });
        }
        break;
      case "DELETE":
        try {
          const { idsToDelete } = req.body;
          await prisma.player.deleteMany({
            where: {
              id: {
                in: idsToDelete,
              },
            },
          });
          res.status(200).end();
        } catch (error) {
          res.status(404).send({ error });
        }
        break;
    }
  } catch (error) {
    console.error("Error inside /api/players", error);
  }
}
