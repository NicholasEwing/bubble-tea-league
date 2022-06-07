const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("MatchRound", {
    gameId: {
      // use for the v5-match API
      type: DataTypes.INTEGER,
    },
    tournamentCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.STRING,
    },
  });
};
