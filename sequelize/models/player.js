const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Player", {
    PUUID: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
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
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    isFreeAgent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
};
