import { Router } from "express";
import {
  postNewsLetter,
  getNewsLetter,
  downloadNewsLetter,
} from  "../controllers/newslatter.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/postnewsletter", verifyJWT, postNewsLetter);

router.get("/getAllNewsletter", verifyJWT, getNewsLetter);

router.get("/downloadExcel", verifyJWT, downloadNewsLetter);

export default router;