const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Player", {
    summonerName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    discordName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    isSubstitute: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
};
