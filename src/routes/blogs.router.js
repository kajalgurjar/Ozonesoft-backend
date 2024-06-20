import { Router } from "express";
import multer from "multer";
import {
  postBlogsData,
  getBlogs,
  deleteBlogs,
  updateBlogs,
} from "../controllers/blogs.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
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
router.put("/blogs/:id", verifyJWT, updateBlogs);
router.delete('/blogs/:id', verifyJWT, deleteBlogs);

export default router;


