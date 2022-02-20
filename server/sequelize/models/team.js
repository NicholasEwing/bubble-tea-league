const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Team", {
    teamName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    logoImgPath: {
      type: DataTypes.STRING,
      unique: true,
    },
  });
};
