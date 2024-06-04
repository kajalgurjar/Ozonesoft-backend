import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Ensure the banners subdirectory exists
const bannersDir = path.join(uploadDir, "banners");
if (!fs.existsSync(bannersDir)) {
  fs.mkdirSync(bannersDir, { recursive: true });
}

// Routes import
import contactRouter from "./routes/contactUs.router.js";
import homeRouter from "./routes/home.router.js"; 
import blogsRouter from "./routes/blogs.router.js"; // Fixed typo here

// Routes declaration
app.use("/api/contact", contactRouter);
app.use("/api/home", homeRouter);
app.use("/api/blogs", blogsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export { app };
