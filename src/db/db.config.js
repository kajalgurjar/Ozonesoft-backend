import { sequelize } from "./admindb.js";
import { Sequelize } from "sequelize";
import BannerModel from "../models/banner.model.js";
import blogsModel from "../models/blogs.model.js";
import contactUsModel from "../models/contactUs.model.js";
import newsLetterModel from "../models/newsLetter.model.js";
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
// Models-table
db.bannerData = BannerModel(sequelize, Sequelize);
db.blogData = blogsModel(sequelize, Sequelize);
db.contactData = contactUsModel(sequelize, Sequelize);
db.newsLetterData = newsLetterModel(sequelize, Sequelize);
export { db };







