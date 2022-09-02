"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MatchRoundPlayerStats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MatchRoundPlayerStats.init(
    {
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
      firstBlood: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      totalDmgToChamps: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      kda: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      championName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      championTransform: {
        type: DataTypes.INTEGER.UNSIGNED, // used for Kayn transformations
        allowNull: false,
        defaultValue: 0,
      },
      champLevel: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      item0: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      item1: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      item2: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      item3: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      item4: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      item5: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      item6: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      summoner1Id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      summoner2Id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      teamPosition: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalMinionsKilled: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      visionScore: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      statPerks: {
        type: DataTypes.STRING, // for a stringified object
        allowNull: false,
      },
      primaryRunePath: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      primaryRunePerks: {
        type: DataTypes.STRING, // for a stringified object
        allowNull: false,
      },
      secondaryRunePath: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      secondaryRunePerks: {
        type: DataTypes.STRING, // for a stringified object
        allowNull: false,
      },
      killParticipation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      teamDamagePercentage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      wardsPlaced: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      wardTakedowns: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      summonerName: {
        type: DataTypes.STRING, // I don't care if this repeats for now I have better things to do than hit my own db 50 times for a name
        allowNull: false,
      },
      attackDamage: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      abilityPower: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      attackSpeed: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      lifesteal: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      armor: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      magicResist: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      teamSide: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MatchRoundPlayerStats",
    }
  );
  return MatchRoundPlayerStats;
};
