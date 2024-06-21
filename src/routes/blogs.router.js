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

// router.post("/postBlogs", upload.single("blogs"), (req, res, next) => {
//   // Handle postBlogsData logic here
//   try {
//     // Assuming postBlogsData handles the logic to save blog data to the database
//     postBlogsData(req, res, next);
//   } catch (error) {
//     // Handle any errors that occur during postBlogsData processing
//     console.error("Error posting blogs:", error);
//     res.status(500).json({ message: "Error posting blogs", error: error.message });
//   }
// });

router.get("/getBlogs", getBlogs);
router.put("/blogs/:id", verifyJWT, updateBlogs);
router.delete('/blogs/:id', verifyJWT, deleteBlogs);

export default router;




