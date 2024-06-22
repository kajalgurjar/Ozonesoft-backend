import { DataTypes } from "sequelize";

export default (sequelize) => {
  const NewsLetter = sequelize.define(
    "news_letter",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return NewsLetter;
};