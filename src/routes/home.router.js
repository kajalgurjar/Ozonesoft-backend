import { Router } from "express";
import { postBannerData, getHomeScreenData

    
} from "../controllers/home.controller.js";

import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.post("/postBanner", upload.single("image"), postBannerData);
// Add other routes if needed
// router.get("/homeData", getHomeScreenData);

export default router;
