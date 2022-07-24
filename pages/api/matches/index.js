import { generateTournamentCodes } from "../../../lib/riot-games-api-helpers";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const sequelize = require("../../../sequelize");
const { Match, MatchRound, Season } = sequelize.models;

export default async function handler(req, res) {
  try {
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
    }
  } catch (error) {
    console.error("Error inside /api/matches", error);
  }
}
