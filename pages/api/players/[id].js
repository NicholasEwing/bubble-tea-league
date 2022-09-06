// import { getIdParam } from "../../../lib/general-api-helpers";
// import { unstable_getServerSession } from "next-auth/next";
// import { authOptions } from "../auth/[...nextauth]";
// import admins from "../../../sequelize/admins";

// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// const sequelize = require("../../../sequelize");
// const { Player } = sequelize.models;

// export default async function handler(req, res) {
//   if (process.env.NODE_ENV === "production") {
//     const session = await unstable_getServerSession(req, res, authOptions);
//     const userIsAdmin = admins.includes(session?.user?.email);
//     if (!userIsAdmin) res.status(401).end();
//   }
//   switch (req.method) {
//     case "GET":
//       const playerId = getIdParam(req);
//       const player = await Player.findByPk(playerId);
//       res.status(200).json(player);
//       break;
//     case "PATCH":
//       const patchId = getIdParam(req);
//       // We only accept an UPDATE request if the `:id` param matches the body `id`
//       if (req.body.id === patchId) {
//         await Player.update(req.body, {
//           where: {
//             id: patchId,
//           },
//         });
//         res.status(200).end();
//       } else {
//         res
//           .status(400)
//           .send(
//             `Bad request: param ID (${id}) does not match body ID (${req.body.id}).`
//           );
//       }
//       break;
//     case "DELETE":
//       const deleteId = getIdParam(req);
//       await Player.destroy({
//         where: {
//           id: deleteId,
//         },
//       });
//       res.status(200).end();
//       break;
//   }
// }
