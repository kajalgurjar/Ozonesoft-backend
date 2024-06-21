import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import StudentList from '../models/admin.model.js'; // Correct import path
import { ApiResponse } from '../utils/ApiResponse.js';

const tokenBlacklist = new Set();

const generateJwtToken = (student) => {
  return jwt.sign(
    { id: student.id, email: student.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '2h' }
  );
};

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const student = await StudentList.findOne({ where: { email } });

  if (!student) {
    throw new ApiError(404, 'Student does not exist');
  }

  const isPasswordValid = await student.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid admin credentials');
  }

  const token = generateJwtToken(student);

  res.status(200).json({
    message: 'Login successful',
    token: token,
    student: {
      id: student.id,
      name: student.name,
      email: student.email,
    },
  });
});

export const logoutController = asyncHandler(async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(400, 'Token is required.');
  }

  // Add the token to the blacklist
  tokenBlacklist.add(token);

  res.status(200).json({
    message: 'Logout successful',
  });
});

// Function to generate a random 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'kajal@gmail.com',
      pass: 'kajal@123',
    },
  });
};

const sendOTPByEmail = async (email, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: '"INSTO Education" <jay439363@gmail.com>',
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP for verification is: ${otp}`,
  };

  try {
    const response = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');

    // OTP expiry logic 
    setTimeout(() => {
      console.log('OTP has expired after 2 minutes');
    }, 2 * 60 * 1000); // 2 minutes in milliseconds

    return new ApiResponse(200, {}, 'OTP Sent Successfully');
  } catch (error) {
    if (
      error.code === 'ECONNRESET' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ETIMEDOUT'
    ) {
      console.error('Network error occurred while sending email:', error);
      throw new ApiError(500, 'Network error occurred while sending email');
    } else {
      console.error('Error sending email:', error);
      throw new ApiError(500, 'Failed to send OTP email');
    }
  }
};

let otp = '';
let dummyEmail = '';

const checkUserAndSendEmail = async (req, res) => {
  const { email } = req.body;

  dummyEmail = email;

  if (!email) {
    throw new ApiError(403, 'Email not received');
  }

  const user = await StudentList.findOne({
    where: { email: email },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  otp = generateOTP();
  console.log(otp);

  try {
    const response = await sendOTPByEmail(email, otp);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// VERIFY OTP
const verifyOtp = asyncHandler(async (req, res) => {
  const { getOtp } = req.body;

  console.log(getOtp);

  if (!getOtp) {
    throw new ApiError(400, 'No OTP sent');
  }

  if (parseInt(getOtp) !== parseInt(otp)) {
    throw new ApiError(403, 'Wrong OTP');
  }

  console.log('OTP verified Successfully');
  res.status(200).json(new ApiResponse(200, {}, 'OTP Verified Successfully'));
});

const updateNewPassword = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: 'Password is required' });
  }

  const student = await StudentList.findOne({ where: { email: dummyEmail } });

  if (!student) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  student.password = password;
  await student.save();

  return res
    .status(200)
    .json({ success: true, message: 'Password updated successfully' });
};

const resendOtp = async (req, res) => {
  const user = await StudentList.findOne({
    where: { email: dummyEmail },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  otp = generateOTP();
  console.log(otp);

  try {
    const response = await sendOTPByEmail(dummyEmail, otp);
    res.status(200).json({ message: 'OTP resent to email' });
  } catch (error) {
    console.error('Error sending OTP mail:', error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export { verifyOtp, updateNewPassword, checkUserAndSendEmail, resendOtp };
