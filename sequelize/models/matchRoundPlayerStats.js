const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("MatchRoundPlayerStats", {
    kills: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    assists: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    deaths: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    champLevel: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    goldEarned: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    visionScore: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  });
};
