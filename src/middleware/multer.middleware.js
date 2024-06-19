// import multer from "multer";
// import path from "path";
// import { fileURLToPath } from "url";
// import fs from "fs";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     let uploadPath = path.join(__dirname, "..", "uploads");

//     // Determine the destination folder based on the request URL
//     if (req.originalUrl.includes("postBlogs")) {
//       uploadPath = path.join(uploadPath, "blogs");
//     } else if (req.originalUrl.includes("postBanner")) {
//       uploadPath = path.join(uploadPath, "banners");
//     } else {
//       console.error("Unsupported route for file upload:", req.originalUrl);
//       return cb(new Error("Unsupported route for file upload"), null);
//     }

//     // Ensure the destination directory exists
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }

//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// // Create multer instance with configured storage
// const upload = multer({
//   storage,
//   fileFilter: function (req, file, cb) {
//     if (file.mimetype.includes("image")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Unsupported file type"), false);
//     }
//   }
// }).single('image'); // Only allow a single 'image' field

// export { upload };



import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import fs from "fs";
import express from "express";
import { promisify } from "util";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Promisify fs methods
const unlinkAsync = promisify(fs.unlink);
const renameAsync = promisify(fs.rename);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.originalUrl.includes("postBlogs")) {
      if (file.fieldname === "gallery_img" && file.mimetype.includes("image")) {
        cb(null, path.join(__dirname, "..", "uploads", "gallery"));
      } else {
        cb(new Error("Unsupported file type"), null);
      }
    } else {
      cb(new Error("Unsupported request URL"), null);
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const bannerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image" && file.mimetype.includes("image")) {
      cb(null, path.join(__dirname, "..", "uploads", "banners"));
    } else {
      cb(new Error("Unsupported file type"), null);
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image" && file.mimetype.includes("image")) {
      cb(null, path.join(__dirname, "..", "uploads", "profile"));
    } else {
      cb(new Error("Unsupported file type"), null);
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const blogStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image" && file.mimetype.includes("image")) {
      cb(null, path.join(__dirname, "..", "uploads", "blog"));
    } else {
      cb(new Error("Unsupported file type"), null);
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
const bannerUpload = multer({ storage: bannerStorage });
const profileUpload = multer({ storage: profileStorage });
const blogUpload = multer({ storage: blogStorage });

const compressImage = async (file) => {
  const filePath = file.path;
  const tempPath = filePath + ".temp";
  try {
    await sharp(filePath)
      .resize({ width: 1024 }) // Resize image
      .toFormat("jpeg", { quality: 70 }) // Compress image
      .toFile(tempPath); // Write to temporary file

    // Replace original file with the compressed file
    await renameAsync(tempPath, filePath);
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
};

const imageCompressionMiddleware = async (req, res, next) => {
  if (!req.files && !req.file) return next();

  // Flatten the arrays of files into a single array
  const files = req.files ? Object.values(req.files).flat() : [req.file];

  // Filter out non-image files (e.g., PDFs)
  const imageFiles = files.filter((file) => file.mimetype.includes("image"));

  // Create an array of promises for compressing image files
  const compressPromises = imageFiles.map((file) => compressImage(file));

  try {
    await Promise.all(compressPromises);
    next();
  } catch (error) {
    next(error);
  }
};

export {
  upload,
  bannerUpload,
  profileUpload,
  blogUpload,
  imageCompressionMiddleware,
};