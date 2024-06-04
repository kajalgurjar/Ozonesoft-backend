import { db } from "../db/db.config.js";

const Banner = db.bannerData;


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

const getHomeScreenData = async (req, res) => {
  try {
    const crouselData = await Crousel.findAll();


    const homedata = {
      crouselData,
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

export {
  postBannerData,
  getHomeScreenData,
};




