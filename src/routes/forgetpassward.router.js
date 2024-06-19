// import { verifyJWT } from "../middlewares/auth.middleware";
import { Router } from "express";

import {
  checkUser,
  verifyOtp,
  verifyToken,
  updateNewPassword,
} from "../controller/forgetpassword.controller.js";


const router = Router();


router.route("/update-new-password").put(updateNewPassword);

router.route("/check-user").post(checkUser);

router.route("/verify-otp").post(verifyOtp);

router.route("/verify-token").post(verifyToken);
 
export default router