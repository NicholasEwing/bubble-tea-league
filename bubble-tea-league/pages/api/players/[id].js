// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const sequelize = require("../../../sequelize");
const { Player } = sequelize.models;

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const player = await Player.findByPk(req.body.id);
      res.status(200).json(player);
      break;
    case "UPDATE":
      // We only accept an UPDATE request if the `:id` param matches the body `id`
      if (req.body.id === id) {
        await Player.update(req.body, {
          where: {
            id: id,
          },
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
      await Player.destroy({
        where: {
          id: req.body.id,
        },
      });
      res.status(200).end();
      break;
  }
}
