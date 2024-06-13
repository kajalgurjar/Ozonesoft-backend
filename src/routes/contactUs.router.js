import { Router } from "express";
import { getContactUs, postcontactUs } from "../controllers/contactUs.controller.js"; // Adjust the path as necessary

const router = Router();

router.post("/Contact", postcontactUs);
router.get("/Contact", getContactUs);


export default router;
