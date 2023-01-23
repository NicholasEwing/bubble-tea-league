import { Player } from "@prisma/client";
import { getPlayerPUUID } from "../../../lib/riot-games-api-helpers";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { isValidEmail } from "../../../lib/utils";
import admins from "../../../admins";
import { NextApiRequest, NextApiResponse } from "next";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { prisma } = require("../../../prisma/db");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
          // We include role here to make life easier for the user,
          // technically "role" is associated with a TEAM, not a PLAYER
          const { player }: { player: Player & { role: string } } = req.body;
          const { id, summonerName, firstName, discordName, role, email } =
            player;

          await prisma.player.update({
            where: {
              id,
            },
            data: {
              summonerName,
              firstName,
              discordName,
              role,
              email,
            },
          });

          res.status(200).end();
        } catch (error) {
          console.log("ERROR", error);
          res.status(500).send(error);
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
    console.error("Error inside /api/player", error);
  }
}
