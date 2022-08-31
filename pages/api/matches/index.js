import { generateTournamentCodes } from "../../../lib/riot-games-api-helpers";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import admins from "../../../sequelize/admins";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const sequelize = require("../../../sequelize");
const { Match, MatchRound, Season } = sequelize.models;

export default async function handler(req, res) {
  try {
    if (process.env.NODE_ENV === "production") {
      const session = await unstable_getServerSession(req, res, authOptions);
      const userIsAdmin = admins.includes(session?.user?.email);
      if (!userIsAdmin) res.status(401).end();
    }
    switch (req.method) {
      // case "POST":
      //   const { season, bestOf } = req.body;
      //   const match = await Match.create({
      //     season,
      //     isPlayoffsMatch: bestOf === 3,
      //   });

      //   const MatchId = match.dataValues.id;
      //   const metadata = {
      //     MatchId,
      //     riotAuth: process.env.BTL_API_KEY,
      //   };

      //   const { tournamentId } = await Season.findByPk(season);

      //   // generate X number of tournament codes via Riot Games API
      //   const tournamentCodes = await generateTournamentCodes(
      //     bestOf,
      //     tournamentId,
      //     [MatchId]
      //   );

      //   // For every code made, make a match round record and slap a tourny code on it
      //   tournamentCodes.forEach(async (tournamentCode) => {
      //     try {
      //       const matchRoundObj = {
      //         MatchId,
      //         tournamentCode,
      //       };

      //       await MatchRound.create(matchRoundObj);
      //     } catch (error) {
      //       console.error("Error inside tourny code loop:", error);
      //     }
      //   });

      //   res.status(201).end();
      //   break;
      case "GET":
        const matches = await Match.findAll();
        res.status(200).json(matches);
        break;
      case "PATCH":
        try {
          const { matches } = req.body;
          await Match.bulkCreate(matches, {
            updateOnDuplicate: ["scheduledTime", "vodLink"],
          });
          res.status(200).send();
        } catch (error) {
          res.status(500).send({ error });
        }
        break;
    }
  } catch (error) {
    console.error("Error inside /api/matches", error);
  }
}
