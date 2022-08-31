const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Match", {
    isPlayoffsMatch: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isUpperBracket: {
      type: DataTypes.BOOLEAN,
    },
    bracketRound: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    scheduledTime: {
      type: DataTypes.DATE,
    },
    vodLink: {
      type: DataTypes.STRING,
      unique: true,
    },
  });
};
