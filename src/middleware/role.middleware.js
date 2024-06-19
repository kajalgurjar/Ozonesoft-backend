
import { ApiError } from "../utils/ApiError.js";

export const rolemiddleware = (...roleSent) => {
  return (req, res, next) => {
    // if the roles sent by the user doesnot match to the User ROLES ["admin" , "teacher", "student"]

    // rolesSent = ["admin" , "teacher", "student"]

    if (!roleSent.includes(req.user.role)) {
      throw new ApiError(403, "Access denied ");
    }

    // route to the next middleware or router Handler
    next();
  };
};