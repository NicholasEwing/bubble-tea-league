"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Team.init(
    {
      teamName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      logoImgPath: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      tricode: {
        type: DataTypes.STRING,
        unique: true,
      },
      season: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Team",
    }
  );
  return Team;
};
