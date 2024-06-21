import Admin from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);

    if (!token) {
      throw new ApiError(401, "Unauthorized token");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds

    if (decodedToken.exp < currentTimestamp) {
      throw new ApiError(401, "Token expired");
    }

    const user = await Admin.findOne({
      where: { id: decodedToken.id },
      attributes: { exclude: ["password", "refreshToken"] },
    });

    if (!user) {
      throw new ApiError(401, "Invalid token Access");
    }

    // Set the user to req.user such that it can be accessed anywhere
    req.admin = user;

    // console.log(user);

    // Store admin id in request for further usage
    next();
  } catch (error) {
    next(new ApiError(401, error?.message || "Invalid Access Token"));
  }
};

