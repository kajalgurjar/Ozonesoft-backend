import { db } from "../db/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { convert } from "html-to-text";

const Banner = db.bannerData;
const BlogList = db.blogsData;

const stripHtml = (html) => {
  return convert(html, {
    wordwrap: 130,
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "img", format: "skip" },
    ],
  });
};

//Post Data For The Banner 
const postBannerData = async (req, res) => {
  try {
    const { title, description, link } = req.body;
    const image = req.file;

    if (!image || !title || !description || !link) {
      return res.status(400).send({ message: "Bad Data" });
    }
    const imagePath = `/uploads/banners/${image.filename}`;
    // Create user object
    const bannerObject = {
      image: imagePath,
      title,
      description,
      link,
    };

    // Log the user object to debug
    // console.log("Creating user with data:", userObject);

    // Create user in the database
    const data = await Banner.create(bannerObject);

    // Send the created user data as the response
    res.send(data);
  } catch (error) {
    // Log the error to debug
    console.error("Error creating banner:", error);

    // Send error response
    res.status(500).send({
      message: error.message || "Some error occurred while creating the banner.",
    });
  }
};

//get APi For The Banner 
const getBannerData = async (req, res) => {
  try {
    const banners = await Banner.findAll();

    res.send(banners);
  } catch (error) {
    // Log and handle the error
    console.error("Error retrieving banners:", error);
    res.status(500).send({
      message: error.message || "Some error occurred while retrieving the banners.",
    });
  }
};

//get home screen data
const getHomeScreenData = async (req, res) => {
  try {
    // const crouselData = await Crousel.findAll();
    const bannerData = await Banner.findAll();
    const blogDataRaw = await BlogList.findAll({
      limit: 3,
      order: [["createdAt", "DESC"]],
    });
  
    const blogData = blogDataRaw.map((blog) => {
      const plainTextDescription = stripHtml(blog.description || "");
      return {
        ...blog.toJSON(),
        description:
          plainTextDescription.substring(0, 50) +
          (plainTextDescription.length > 50 ? "..." : ""),
      };
    });

    const homedata = {
      bannerData,
      blogData,
    };

    res.send({ homedata });
  } catch (error) {
    console.error("Error retrieving Crousel data:", error);
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while retrieving the Crousel data.",
    });
  }
};

// res
//     .status(200)
//     .json(new ApiResponse(200, { homedata }, "Home data fetched successfully"));

export {
  postBannerData,
  getBannerData,
  getHomeScreenData,
  
};