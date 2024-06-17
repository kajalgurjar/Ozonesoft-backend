import { Router } from "express";
import {
  postBlogsData,
  getBlogs,
  deleteBlogs,
  updateBlogs,
} from "../controllers/blogs.controller.js";

import { upload } from "../middleware/multer.middleware.js";

const router = Router();
router.post("/postBlogs", upload.single("image"), postBlogsData);
router.get("/getBlogs", getBlogs);
router.put("/blogs/:id",updateBlogs);
router.delete('/blogs/:id', deleteBlogs);
export default router;