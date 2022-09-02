"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MatchRound extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MatchRound.init(
    {
      gameId: DataTypes.STRING, // use for the v5-match API
      tournamentCode: { type: DataTypes.STRING, allowNull: false },
      metaData: DataTypes.STRING,
      gameDuration: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MatchRound",
    }
  );
  return MatchRound;
};
