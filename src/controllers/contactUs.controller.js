import { db } from "../db/db.config.js";

const Contact = db.contactData;

const postcontactUs = async (req, res) => {
  try {
    const { name, email, mobileNumber, message } = req.body;

    if (!name || !email || !mobileNumber || !message) {
      return res.status(400).send({ message: "Bad Data" });
    }

    // Create user object
    const contactUsObject = {
      name,
      email,
      mobileNumber,
      message,
    };

    // Create contact in the database using userObject
    const data = await Contact.create(contactUsObject);

    // Send the created contact data as the response
    res.send(data);
  } catch (error) {
    // Log and handle the error
    console.error("Error creating contact:", error);
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Contact.",
    });
  }
};

export { postcontactUs };
