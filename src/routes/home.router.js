import { Router } from "express";
import multer from "multer";
import {
  postBannerData,
  getHomeScreenData,
  getBannerData
  
} from "../controllers/home.controller.js";

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import verifyAPIKey from "../middleware/verifyAPIKey.js";

const router = Router();

router.post("/postBanner", (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(500).json(err);
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json(err);
    }
    // Everything went fine.
    postBannerData(req, res, next);
  });
});

router.get("/getBanner",verifyAPIKey,getBannerData);
router.get("/homeData", verifyAPIKey, getHomeScreenData);


export default router;
