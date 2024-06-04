import { db } from "../db/db.config.js";
// import { ApiError } from "../utils/ApiError.js";
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

const getBlogs = async (req, res) => {
  try {
    const blogs = await BlogList.findAll(); // Fetch all blogs from the database
    res.send({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(error.status || 500).send({ message: error.message || "Error fetching blogs" });
  }
};

const deleteBlogs = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      throw new ApiError(403, "Blog ID is required");
    }

    const blog = await BlogList.findByPk(id);

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    const isDeleted = await BlogList.destroy({
      where: {
        id: id,
      },
    });

    if (!isDeleted) {
      throw new ApiError(500, "Facing some issue deleting this blog");
    }

    res.status(200).json(new ApiResponse(200, {}, "Blog deleted successfully"));
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(error.status || 500).send({ message: error.message || "Error deleting blog" });
  }
};

export { postBlogsData, getBlogs, deleteBlogs };
