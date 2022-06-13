import { DataTypes } from "sequelize";

export default (sequelize) => {
  sequelize.define("Team", {
    teamName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
