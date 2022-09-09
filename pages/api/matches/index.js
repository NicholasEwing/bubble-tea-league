import { generateTournamentCodes } from "../../../lib/riot-games-api-helpers";
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
      case "PATCH":
        try {
          const { matches } = req.body;
          for (const match of matches) {
            const { scheduledTime, vodLink, id } = match;

            await prisma.match.update({
              where: {
                id,
              },
              data: {
                scheduledTime: new Date(scheduledTime),
                vodLink,
              },
            });
          }
          res.status(200).send();
        } catch (error) {
          res.status(500).send(error);
        }
        break;
    }
  } catch (error) {
    console.error("Error inside /api/matches", error);
  }
}
