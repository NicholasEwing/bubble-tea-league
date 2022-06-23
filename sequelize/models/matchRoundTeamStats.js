const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("MatchRoundTeamStats", {
    kills: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    goldEarned: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    towersDestroyed: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    heraldsKilled: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    dragonsKilled: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    inhibitorsDestroyed: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    baronsKilled: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  });
};
