import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { db } from "../db/db.config.js";

const StudentList = db.studentListData;
const tokenBlacklist = new Set(); // Memory-based blacklist

export const verifyUserJwt = asyncHandler(async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("No token provided");
      throw new ApiError(401, "Unauthorized token");
    }

    // Check if the token is blacklisted
    if (tokenBlacklist.has(token)) {
      console.log("Token is blacklisted", token);
      throw new ApiError(401, "Token has been invalidated.");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await StudentList.findOne({
      where: { id: decodedToken.id },
      attributes: { exclude: ["password", "refreshToken"] },
    });

    if (!user) {
      console.log("User not found for token", decodedToken);
      throw new ApiError(401, "Invalid token Access");
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error verifying token", error.message);
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});