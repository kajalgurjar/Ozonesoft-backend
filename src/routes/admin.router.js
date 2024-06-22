import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  showProfile,
  updateProfile,
  updatePassword,
  registerUser,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
// import { profileUpload } from "../middleware/multer.middleware.js";
const router = Router();
router.post("/login", loginAdmin);
router.post("/logout", verifyJWT, logoutAdmin);
// router.put(
//   "/update-profile",
//   verifyJWT,
//   profileUpload.single("image"),
//   updateProfile
// );
router.get("/profile", verifyJWT, showProfile);
router.put("/update-password", verifyJWT, updatePassword);
router.post("/signup", registerUser);
export default router;