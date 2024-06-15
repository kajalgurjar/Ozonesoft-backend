import { db } from "../db/db.config.js";
import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

const BlogList = db.blogsData;

const postBlogsData = async (req, res) => {
  try {
    const { title, description, posted_By, meta_title, meta_description } = req.body;
    const blogImage = req.file;

    // Check if required fields are present
    if (!blogImage || !title || !description || !posted_By) {
      throw new ApiError(400, "Bad Data");
    }

    // Create blog object
    const blogObject = {
      image: `/uploads/blog/${blogImage.filename}`,
      title,
      description,
      posted_By,
      meta_title,
      meta_description,
    };

    // Create blog in the database
    const data = await BlogList.create(blogObject);

    // Send the created blog data as the response
    res.send(data);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(error.status || 500).send({ message: error.message || "Error creating blog" });
  }
};
//---------------------------------------------------------------
const getBlogs = async (req, res) => {
  try {
    const blogs = await BlogList.findAll(); // Fetch all blogs from the database
    res.send({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(error.status || 500).send({ message: error.message || "Error fetching blogs" });
  }
};
//--------------------------------------------------------------
const updateBlogs = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedId = id.replace(":", ""); // Remove any colon if present

    const { title, description, posted_By, meta_title, meta_description } = req.body;
    const blogImage = req.file;

    // Log incoming data for debugging
    console.log("Updating blog with ID:", parsedId);
    console.log("Updated blog data:", { title, description, posted_By, meta_title, meta_description });

    let imagePath = "";

    if (blogImage) {
      imagePath = `/uploads/blog/${blogImage.filename}`;
    }

    const blog = await BlogList.findByPk(parsedId);

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    // Update blog properties
    if (title) blog.title = title;
    if (description) blog.description = description;
    if (posted_By) blog.posted_By = posted_By;
    if (meta_title) blog.meta_title = meta_title;
    if (meta_description) blog.meta_description = meta_description;

    if (imagePath) blog.image = imagePath;

    // Save updated blog
    await blog.save();

    const updatedBlog = await BlogList.findOne({
      where: { id: blog.id },
    });

    if (!updatedBlog) {
      throw new ApiError(404, "Failed to retrieve updated blog data");
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedBlog, "Blog updated successfully"));
  } catch (error) {
    console.error("Error updating blog:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

//---------------------------------------------------------------
const deleteBlogs = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Delete request for blog with ID:", id); // Debugging log

    if (!id) {
      throw new ApiError(403, "Blog ID is required");
    }

    // Check the type of id and make sure it's a number
    if (isNaN(Number(id))) {
      throw new ApiError(400, "Invalid Blog ID");
    }

    const blog = await BlogList.findByPk(id);
    console.log("Blog found:", blog); // Debugging log

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    const isDeleted = await BlogList.destroy({
      where: { id: id },
    });

    console.log("Is deleted:", isDeleted); // Debugging log
    
    if (!isDeleted) {
      throw new ApiError(500, "Facing some issue deleting this blog");
    }

    res.status(200).json("Blog deleted successfully");
  } catch (error) {
    console.error("Error deleting blog:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};



export { postBlogsData, getBlogs,updateBlogs, deleteBlogs };
