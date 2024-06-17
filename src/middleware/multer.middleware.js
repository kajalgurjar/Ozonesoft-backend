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

    // Determine the destination folder based on file type
    if (file.mimetype.includes("image")) {
      uploadPath = path.join(uploadPath, "banners");
    } else if (file.mimetype.includes("blog")) {
      uploadPath = path.join(uploadPath, "blogs");
    } else {
      return cb(new Error("Unsupported file type"), null);
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

// File filter for multer to accept only image and blog files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes("image") || file.mimetype.includes("blog")) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

// Create multer instance with configured storage and filter
const upload = multer({ storage, fileFilter });

export { upload };
