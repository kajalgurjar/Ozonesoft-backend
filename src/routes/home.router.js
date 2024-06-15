import { Router } from "express";
import { postBannerData, getHomeScreenData ,getBannerData

    
} from "../controllers/home.controller.js";

import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.post("/postBanner", upload.single("image"), postBannerData);
router.get("/getBanner" , upload.single("image"), getBannerData);
router.get("/homeData", getHomeScreenData);

export default router;
