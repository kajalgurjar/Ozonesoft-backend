import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Admin from "../models/admin.model.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Function to generate a random 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

// Function to create a Nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
   
    auth: {
      user: "jay439363@gmail.com", // Your Gmail address
      pass: "lwoxlcjtbmewosnc", // Your app password
    },
  });
};

// Function to send OTP via email
const sendOTPByEmail = async (email, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"INSTO Education" <jay439363@gmail.com>`, // Your Gmail address
    to: email,
    subject: "OTP Verification",
    text: `Your OTP for verification is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    if (
      error.code === "ECONNRESET" ||
      error.code === "ENOTFOUND" ||
      error.code === "ETIMEDOUT"
    ) {
      console.error("Network error occurred while sending email:", error);
      res.status(500).send({
        message: "Network error occurred while sending email",
        error: error.message,
      });
    } else {
      console.error("Error sending email:", error);
      res
        .status(500)
        .send({ message: "Error sending email", error: error.message });
    }
    throw new ApiError(500, "Failed to send OTP email due to network error");
  }
};

// Variable to store OTP globally
let otp = "";

// Controller function to check user and send OTP
const checkUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "No email provided");
  }

  const user = await Admin.findOne({
    where: { email },
    attributes: { exclude: ["password", "refreshToken"] },
  });

  if (!user) {
    throw new ApiError(404, "User not found with this email");
  }

  otp = generateOTP();

  console.log(otp);

  try {
    await sendOTPByEmail(email, otp);
    res
      .status(200)
      .json(new ApiResponse(200, { email, otp }, "OTP sent successfully"));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { getOtp, email } = req.body;

  console.log("Request body:", req.body); // Log the request body for debugging
  console.log("getOtp:", getOtp, "email:", email); // Log individual values

  if (!getOtp) {
    throw new ApiError(400, "No OTP sent");
  }

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  console.log(getOtp, otp);

  if (parseInt(getOtp) !== parseInt(otp)) {
    res.status(403).send({
      message: "Network error occurred while sending email",
      error: error.message,
    });

    throw new ApiError(403, "Wrong OTP");
  } else {
    console.log("OTP verified Successfully");

    const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1m",
    });

    console.log("Generated token:", token);

    // Update the forgetToken field in the User model
    const [updated] = await Admin.update(
      { forgetToken: token },
      { where: { email } }
    );

    if (updated) {
      res
        .status(200)
        .json(new ApiResponse(200, { token }, "OTP verified successfully"));

      // Schedule token deletion after 5 minutes
      const expiryTime = 2 * 60 * 1000; // 5 minutes in milliseconds
      const interval = 1000; // 1 second in milliseconds
      const remainingTime = expiryTime / interval;
      let secondsLeft = remainingTime;

      const timer = setInterval(() => {
        console.log("Token will be deleted in:", secondsLeft, "seconds");
        secondsLeft--;

        if (secondsLeft < 0) {
          clearInterval(timer);
          console.log("Token deleted successfully after 5 minutes");
          // Delete the token from the database
          Admin.update({ forgetToken: null }, { where: { email } });
        }
      }, interval);
    } else {
      throw new ApiError(404, "User not found");
    }
  }
});

const verifyToken = asyncHandler(async (req, res) => {
  const { token, email } = req.body;

  try {
    // Find user by email in the database
    const user = await Admin.findOne({ where: { email } });

    // If user found and token matches, return valid token
    if (user && user.forgetToken === token) {
      res.status(200).json({ message: "Valid token" });
    } else {
      res.status(400).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const updateNewPassword = async (req, res) => {
  const { password, email } = req.body;

  try {
    // Check if password is provided
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    const user = await Admin.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update user's password
    user.password = password;
    await user.save(); // This will trigger the beforeUpdate hook

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { checkUser, verifyOtp, verifyToken, updateNewPassword };