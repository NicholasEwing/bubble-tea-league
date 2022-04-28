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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    metaData: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
