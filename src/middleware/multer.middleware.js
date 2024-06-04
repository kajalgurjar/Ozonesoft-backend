import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "thumbnail" && file.mimetype.includes("image")) {
      cb(null, path.join(__dirname, "..", "uploads", "thumbnails")); // Destination for thumbnails
    } else if (file.fieldname === "image" && file.mimetype.includes("image")) {
      cb(null, path.join(__dirname, "..", "uploads", "banners")); // Destination for thumbnails
    } else if (file.mimetype.includes("image")) {
      cb(null, path.join(__dirname, "..", "uploads", "images")); // Destination for images
    } else if (file.mimetype.includes("pdf")) {
      cb(null, path.join(__dirname, "..", "uploads", "pdfs")); // Destination for PDFs
    } else {
      cb(new Error("Unsupported file type"), null);
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Adding timestamp to avoid file name collisions
  },
});

const upload = multer({ storage });

export { upload };
