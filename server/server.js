const { DataTypes } = require("sequelize");
const sequelize = require("./db");

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connected!");
//   })
//   .catch((error) => console.log(error));

// ✅ create btl database

// create model for:
// - ✅ teams
const Team = sequelize.define("Team", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  teamName: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  logoImgPath: {
    type: DataTypes.STRING,
    unique: true,
  },
});

// - ✅ players

const Player = sequelize.define("Player", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  summonerName: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  discordName: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  isSubstitute: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

Team.hasMany(Player, {
  foreignKey: {
    allowNull: false,
  },
});

Player.belongsTo(Team);

// - ✅ matches
const Match = sequelize.define("Match", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATE,
  },
  bestOf: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
});

// - ✅ match rounds
const MatchRound = sequelize.define("Match Round", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  gameLength: {
    type: DataTypes.DATE,
  },
  roundNumber: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
});

// ✅ connect match rounds to a match
Match.hasMany(MatchRound);
MatchRound.belongsTo(Match);

// ✅ connect blue / red teams and winner to a match round
Match.belongsTo(Team, { as: "winner" });
Match.belongsTo(Team, { as: "redTeam", foreignKey: { allowNull: false } });
Match.belongsTo(Team, { as: "blueTeam", foreignKey: { allowNull: false } });

// connect team stats to match round

// - match round player stats

// add a team to the db

// pull team name from the db, make a team

// add 5 teams to the db

// write logic to create all 5 teams, organize the staticGen logic into a class for each template

async function initDb() {
  try {
    const result = await sequelize.sync({ force: true }); // remove force: true for production
    console.log(result);
    console.log("everything worked!");
  } catch (e) {
    console.error(e);
  }
}

initDb();
