import { Router } from "express";
import { getContactUs, postcontactUs } from "../controllers/contactUs.controller.js"; // Adjust the path as necessary
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/Contact", verifyJWT, postcontactUs);
router.get("/Contact", verifyJWT, getContactUs);


export default router;
