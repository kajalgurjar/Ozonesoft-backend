import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default (sequelize) => {
  const Admin = sequelize.define(
    "Admin",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING, // Assuming role is a string
        defaultValue: "admin",
      },
      number: {
        type: DataTypes.STRING, // Assuming number is a string
        defaultValue: "111111111",
      },
      refreshToken: {
        type: DataTypes.STRING,
      },
      forgetToken: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      image: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      accessToken: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
      tableName: "ADMIN", // Assuming table name is "ADMIN"
    }
  );

  Admin.beforeCreate(async (admin) => {
    if (admin.password) {
      admin.password = await bcrypt.hash(admin.password, 10);
    }
  });

  Admin.beforeUpdate(async (admin) => {
    if (admin.changed("password")) {
      admin.password = await bcrypt.hash(admin.password, 10);
    }
  });

  Admin.prototype.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  Admin.prototype.generateAccessToken = function () {
    return jwt.sign(
      {
        id: this.id,
        email: this.email,
        name: this.name,
        role: this.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
  };

  Admin.prototype.generateRefreshToken = function () {
    return jwt.sign(
      {
        id: this.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
  };

  Admin.prototype.generateAndSaveRefreshTokens = async function () {
    const refreshToken = this.generateRefreshToken();
    this.refreshToken = refreshToken;
    await this.save({ validate: false });
    return { refreshToken };
  };

  Admin.prototype.generateAndSaveAccessTokens = async function () {
    const accessToken = this.generateAccessToken();
    this.accessToken = accessToken;
    await this.save({ validate: false });
    return { accessToken };
  };

  return Admin; // Ensure to return Admin at the end of the function
};
