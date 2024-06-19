import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log("Auth Header: ", authHeader);
  
  if (!authHeader) {
    return next(new ApiError(403, 'A token is required for authentication'));
  }
  
  const token = authHeader.split(' ')[1];
  console.log("Token: ", token);

  if (!token) {
    return next(new ApiError(403, 'A token is required for authentication'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    console.log("Decoded: ", decoded);
    req.user = decoded;
    return next();
  } catch (err) {
    console.error("Token verification error: ", err);
    return next(new ApiError(401, 'Invalid Token'));
  }
};
