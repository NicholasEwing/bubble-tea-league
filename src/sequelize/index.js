require("dotenv").config();
const Sequelize = require("sequelize");
const applyAssociations = require("./applyAssociations");
const mysql2 = require("mysql2");

let sequelize;

// Register AWS DB creds and create new sequelize instance
if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(
    "btl_db",
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.RDS_HOST,
      port: 3306,
      dialect: "mysql",
      dialectModule: mysql2, // Needed to fix sequelize issues with WebPack
      // pool: {
      //   max: 5,
      //   min: 0,
      //   idle: 20000,
      //   acquire: 20000,
      // },
    }
  );
} else {
  sequelize = new Sequelize("btl_db", "root", process.env.LOCAL_DB_PASSWORD, {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
    dialectModule: mysql2, // Needed to fix sequelize issues with WebPack
  });
}

// Define all models and then attaches them to sequelize.models
const modelDefiners = [
  require("./models/team"),
  require("./models/season"),
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

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connection has been established successfully.");
//   })
//   .catch((err) => {
//     console.log("Unable to connect to the database:", err);
//   });

// sequelize
//   .getQueryInterface()
//   .showAllSchemas()
//   .then((tableObj) => {
//     console.log("// Tables in database", "==========================");
//     console.log(tableObj);
//   })
//   .catch((err) => {
//     console.log("showAllSchemas ERROR", err);
//   });

// export the sequelize instance to be used elsewhere
module.exports = sequelize;
