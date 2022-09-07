import { getIdParam } from "../../../lib/general-api-helpers";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import admins from "../../../prisma/db";

const { prisma } = require("../../../prisma/db");

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async function handler(req, res) {
  if (process.env.NODE_ENV === "production") {
    const session = await unstable_getServerSession(req, res, authOptions);
    const userIsAdmin = admins.includes(session?.user?.email);
    if (!userIsAdmin) res.status(401).end();
  }
  switch (req.method) {
    case "GET":
      const playerId = getIdParam(req);
      const player = await prisma.player.findUnique({
        where: {
          playerId,
        },
      });
      res.status(200).json(player);
      break;
    case "PATCH":
      const patchId = getIdParam(req);
      // We only accept an UPDATE request if the `:id` param matches the body `id`
      if (req.body.id === patchId) {
        await prisma.player.update({
          where: {
            id: patchId,
          },
          data: req.body,
        });
        res.status(200).end();
      } else {
        res
          .status(400)
          .send(
            `Bad request: param ID (${id}) does not match body ID (${req.body.id}).`
          );
      }
      break;
    case "DELETE":
      const deleteId = getIdParam(req);
      await prisma.player.delete({
        where: { id: deleteId },
      });
      res.status(200).end();
      break;
  }
}
