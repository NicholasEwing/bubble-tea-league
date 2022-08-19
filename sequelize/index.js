const Sequelize = require("sequelize");
const applyAssociations = require("./applyAssociations");
const config = require("./config/config");

let database, username, password, host, port, dialect;

if (process.env.NODE_ENV === "test") {
  ({ database, username, password, host, port, dialect } = config.test);
} else if (process.env.NODE_ENV === "development") {
  ({ database, username, password, host, port, dialect } = config.development);
}

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect,
  logging: false,
  // query: { raw: true }, // this breaks next-auth lol
});

// Define all models and then attaches them to sequelize.models
const modelDefiners = [
  require("./models/team"),
  require("./models/provider"),
  require("./models/season"),
  require("./models/player"),
  require("./models/match"),
  require("./models/matchRound"),
  require("./models/matchRoundTeamStats"),
  require("./models/matchRoundPlayerStats"),
  require("./models/playerTeamHistory"),
  require("./models/teamStanding"),
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

// Apply our associations to all models
applyAssociations(sequelize);

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connection has been established successfully.");
//   })
//   .catch((err) => {
//     console.log("Unable to connect to the database:", err);
//   });

// export the sequelize instance to be used elsewhere
module.exports = sequelize;
