require("dotenv").config();
const Sequelize = require("sequelize");
const applyAssociations = require("./applyAssociations");

// Register AWS DB creds and create new sequelize instance
const sequelize = new Sequelize(
  "btl_db",
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.RDS_HOST,
    port: 3306,
    dialect: "mysql",
  }
);

// Define all models and then attaches them to sequelize.models
const modelDefiners = [
  require("./models/team"),
  require("./models/player"),
  require("./models/match"),
  require("./models/matchRound"),
  require("./models/matchRoundTeamStats"),
  require("./models/matchRoundPlayerStats"),
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

// Apply our associations to all models
applyAssociations(sequelize);

// export the sequelize instance to be used elsewhere
module.exports = sequelize;
