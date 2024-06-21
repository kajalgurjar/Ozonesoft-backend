import Admin from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import { Op } from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const unlinkAsync = promisify(fs.unlink);

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([email, name, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await Admin.findOne({
    where: {
      [Op.or]: [{ name: name.toLowerCase() }, { email: email.toLowerCase() }],
    },
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await Admin.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password,
  });

  const { refreshToken } = await user.generateAndSaveRefreshTokens();

  const createdUser = await Admin.findOne({
    where: { id: user.id },
    attributes: { exclude: ["password", "refreshToken"] },
  });

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const admin = await Admin.findOne({ where: { email: email.toLowerCase() } });

  if (!admin) {
    throw new ApiError(404, "Admin does not exist");
  }

  const isPasswordValid = await admin.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid admin credentials");
  }

  const { accessToken } = await admin.generateAndSaveAccessTokens();

  const loggedInAdmin = await Admin.findOne({
    where: { id: admin.id },
    attributes: { exclude: ["password", "refreshToken"] },
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { admin: loggedInAdmin, accessToken },
        "Admin logged in successfully"
      )
    );
});

const logoutAdmin = asyncHandler(async (req, res) => {
  const adminId = req.admin.id;

  const admin = await Admin.findByPk(adminId);
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const data = await admin.update({ accessToken: null });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, { data }, "Admin logged out successfully"));
});

const updatePassword = asyncHandler(async (req, res, next) => {
  const { id } = req.admin;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  const admin = await Admin.findByPk(id);

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Current password is incorrect");
  }

  admin.password = newPassword;
  await admin.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

const showProfile = asyncHandler(async (req, res) => {
  const data = req.admin;

  res.status(200).json(new ApiResponse(200, { data }, "Profile"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { id } = req.admin;
  const { name, email, number } = req.body;
  const image = req.file;

  let imagePath = "";

  if (image) {
    imagePath = `/uploads/profile/${image.filename}`;

    if (req.admin.image) {
      const fullOldImagePath = path.join(
        __dirname,
        "..",
        "uploads",
        "profile",
        path.basename(req.admin.image)
      );
      await unlinkAsync(fullOldImagePath);
    }
  }

  const admin = await Admin.findByPk(id);

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  if (email) {
    const existingAdmin = await Admin.findOne({
      where: { email: email.toLowerCase() },
      attributes: ["id"],
    });

    if (existingAdmin && existingAdmin.id !== id) {
      throw new ApiError(400, "Email already exists");
    }
  }

  if (name) admin.name = name.toLowerCase();
  if (email) admin.email = email.toLowerCase();
  if (number) admin.number = number;
  if (imagePath) admin.image = imagePath;

  await admin.save();

  const updatedAdmin = await Admin.findOne({
    where: { id: admin.id },
    attributes: { exclude: ["password", "refreshToken"] },
  });

  if (!updatedAdmin) {
    throw new ApiError(404, "Failed to retrieve updated admin data");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedAdmin, "Admin profile updated successfully"));
});

export {
  loginAdmin,
  logoutAdmin,
  showProfile,
  updateProfile,
  updatePassword,
  registerUser,
};
