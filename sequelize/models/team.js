const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Team", {
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
  });
};
