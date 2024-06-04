import { Router } from "express";
import {
  postBlogsData,
  getBlogs,
  deleteBlogs,
} from "../controllers/blogs.controller.js";

import { upload } from "../middleware/multer.middleware.js";

const router = Router();
router.post("/postBlogs", upload.single("image"), postBlogsData);

router.get("/get-blogs", getBlogs);

router.delete("/delete-blogs/:id", deleteBlogs);

export default router;