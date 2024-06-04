import { Router } from "express";
import { postcontactUs } from "../controllers/contactUs.controller.js"; // Adjust the path as necessary

const router = Router();

router.post("/postContact", postcontactUs);

export default router;
