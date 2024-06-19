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

//Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//Ensure the banners subdirectory exists
const bannersDir = path.join(uploadDir, "banners");
if (!fs.existsSync(bannersDir)) {
  fs.mkdirSync(bannersDir, { recursive: true });
}

const blogsDir = path.join(uploadDir, "blogs");
if (!fs.existsSync(blogsDir)) {
  fs.mkdirSync(blogsDir, { recursive: true });
}

// Routes import
import contactRouter from "./routes/contactUs.router.js";
import homeRouter from "./routes/home.router.js"; 
import blogsRouter from "./routes/blogs.router.js";
import newslatterRouter from "./routes/newslatter.router.js";
import userRouter from "./routes/user.router.js"
import adminRouter from "./routes/admin.router.js"
import forgetPasswordRouter from "./routes/forgetpassword.router.js"
import { verifyJWT } from "./middleware/auth.middleware.js";

// Routes declaration
app.use('/api/v1/contact', contactRouter);
app.use('/api/v1/home', homeRouter); // Assuming home doesn't require auth
app.use('/api/v1/blogs', blogsRouter);
app.use('/api/v1/newsletter', newslatterRouter);
app.use("/api/v1/user", userRouter);
app.use("/", adminRouter);
app.use("/", forgetPasswordRouter);
app.use("/" , adminRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export { app };
