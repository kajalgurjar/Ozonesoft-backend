import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import contactUsModel from "../models/contactUs.model.js";
import BannerModel from "../models/banner.model.js";
import blogsModel from "../models/blogs.model.js";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  }
);

console.log("dbName", process.env.DB_NAME);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models-table
db.contactData = contactUsModel(sequelize, Sequelize);
db.bannerData = BannerModel(sequelize, Sequelize);
db.blogsData = blogsModel(sequelize,Sequelize);
// db.getHomeScreenData = homescreenModel(sequelize, Sequelize);

export { db };
