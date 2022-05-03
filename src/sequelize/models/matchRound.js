const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("MatchRound", {
    winningTeam: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    losingTeam: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    gameId: {
      // use for the v5-match API
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tournamentCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    metaData: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
