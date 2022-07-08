const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Season", {
    number: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      allowNull: false,
    },
    tournamentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
    },
    year: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  });
};
