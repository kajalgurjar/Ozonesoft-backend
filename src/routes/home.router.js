import { Router } from "express";
import multer from "multer";
import {
  postBannerData,
  getHomeScreenData,
  getBannerData
  
} from "../controllers/home.controller.js";

import { upload } from "../middleware/multer.middleware.js";

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

router.get("/getBanner", getBannerData);
router.get("/homeData", getHomeScreenData);


export default router;
