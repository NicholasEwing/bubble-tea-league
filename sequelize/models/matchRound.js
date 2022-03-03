const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("MatchRound", {
    gameLength: {
      type: DataTypes.DATE,
    },
    roundNumber: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  });
};
