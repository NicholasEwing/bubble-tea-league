const sequelize = require("../../../sequelize");
const { Team } = sequelize.models;

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "GET":
        const teams = await Team.findAll();
        res.status(200).json(teams);
        break;
      case "POST":
        const team = await Team.create(req.body);
        res.status(201).end();
        break;
      case "UPDATE":
        await Team.create(req.body);
        res.status(201).end();
        break;
    }
  } catch (error) {
    console.error("Error inside /api/teams", error);
  }
}
