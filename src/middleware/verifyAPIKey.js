import { ApiError } from "../utils/ApiError.js";

const verifyAPIKey = (req, res, next) => {
 
    const apiKey = req.header("api_key");
  if (!apiKey) {
    return next(new ApiError(401, "API key is missing"));
  }

  if (apiKey !== process.env.API_KEY) {
    return next(new ApiError(401, "Invalid API key"));
  }

  next();
};

export default verifyAPIKey;