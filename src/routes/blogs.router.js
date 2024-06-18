import { Router } from "express";
import multer from "multer";
import {
  postBlogsData,
  getBlogs,
  deleteBlogs,
  updateBlogs,
} from "../controllers/blogs.controller.js";

import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.post("/postBlogs", (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(500).json(err);
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json(err);
    }
    // Everything went fine.
    postBlogsData(req, res, next);
  });
});

router.get("/getBlogs", getBlogs);
router.put("/blogs/:id", updateBlogs);
router.delete('/blogs/:id', deleteBlogs);

export default router;
