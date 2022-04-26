const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Season", {
    number: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  });
};
