const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Season", {
    number: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      defaultValue: 8,
      unique: true,
      primaryKey: true,
    },
    tournamentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
    },
  });
};
