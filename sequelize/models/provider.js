import { DataTypes } from "sequelize";

export default (sequelize) => {
  sequelize.define("Provider", {
    providerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
    },
  });
};
