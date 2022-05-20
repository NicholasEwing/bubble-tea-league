const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Provider", {
    providerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
    },
  });
};
