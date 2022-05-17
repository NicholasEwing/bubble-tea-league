const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Player", {
    PUUID: {
      type: DataTypes.STRING,
      unique: true,
    },
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
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Fill",
    },
  });
};
