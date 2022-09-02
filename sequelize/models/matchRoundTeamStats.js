"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MatchRoundTeamStats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MatchRoundTeamStats.init(
    {
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
    },
    {
      sequelize,
      modelName: "MatchRoundTeamStats",
    }
  );
  return MatchRoundTeamStats;
};
