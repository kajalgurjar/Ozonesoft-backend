import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = path.join(__dirname, "..", "uploads");

    // Determine the destination folder based on the request URL
    if (req.originalUrl.includes("postBlogs")) {
      uploadPath = path.join(uploadPath, "blogs");
    } else if (req.originalUrl.includes("postBanner")) {
      uploadPath = path.join(uploadPath, "banners");
    } else {
      console.error("Unsupported route for file upload:", req.originalUrl);
      return cb(new Error("Unsupported route for file upload"), null);
    }

    // Ensure the destination directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Create multer instance with configured storage
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.includes("image")) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"), false);
    }
  }
}).single('image'); // Only allow a single 'image' field

export { upload };
