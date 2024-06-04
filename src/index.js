import dotenv from "dotenv";
import { db } from "./db/db.config.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

//to create database
db.sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log("Server is running");
      console.log("Mysql Is connected successfully....")
    });
  })
  .catch((err) => {
    console.log("Mysql db connection failed", err);
  });
