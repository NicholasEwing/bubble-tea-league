const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "TeamStanding",
    {
      placement: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
