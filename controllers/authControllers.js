import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {
  acceptOtpCodeSchema,
  changePasswordSchema,
  signinSchema,
  signupSchema,
} from "../middlewares/validator.js";
import { doHash, doHashValidation } from "../utils/hashing.js";
import transporter from "../middlewares/sendMail.js";

const salt = 12;

export const postSignup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { error } = signupSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists!" });
    }

    const hashedPassword = await doHash(password, salt);
    const newUser = new User({ email, password: hashedPassword });
    const result = await newUser.save();

    result.password = undefined;

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: `Signup failed: ${error}` });
  }
};


export const postSignin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { error } = signinSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email }).select("password _id");
    if (!existingUser) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isValid = await doHashValidation(password, existingUser.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const payload = { user: { id: existingUser._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });

    return res
      .cookie("Authorization", "Bearer " + token, {
        expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({ success: true, token, message: "Signin successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: `Signin failed: ${error}` });
  }
};

export const postOtpVerificationSend = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (existingUser.verified) {
      return res.status(400).json({ success: false, message: "User already verified" });
    }

    const otpCode = String(Math.floor(100000 + Math.random() * 900000));

    await transporter.sendMail({
      from: process.env.NODE_MAILER_EMAIL,
      to: existingUser.email,
      subject: "Email Verification Code",
      html: `<h1>${otpCode}</h1>`,
    });

    existingUser.verificationCode = otpCode;
    existingUser.verificationCodeValidation = Date.now();
    await existingUser.save();

    return res.status(201).json({
      success: true,
      message: "OTP sent to your email successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: `OTP send failed: ${error}` });
  }
};

export const verifyVerificationCode = async (req, res) => {
  const { email, providedCode } = req.body;

  try {
    const { error } = acceptOtpCodeSchema.validate({ email, providedCode });
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (existingUser.verified) {
      return res.status(400).json({ success: false, message: "User already verified" });
    }

    if (!existingUser.verificationCode || !existingUser.verificationCodeValidation) {
      return res.status(400).json({ success: false, message: "OTP not generated or invalid" });
    }

    if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
      return res.status(400).json({ success: false, message: "OTP expired. Please request again." });
    }

    if (String(existingUser.verificationCode) !== String(providedCode)) {
      return res.status(400).json({ success: false, message: "Incorrect OTP" });
    }

    existingUser.verified = true;
    existingUser.verificationCode = undefined;
    existingUser.verificationCodeValidation = undefined;
    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: `Verification failed: ${error}` });
  }
};

export const postChangePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  try {
    const { error } = changePasswordSchema.validate({ oldPassword, newPassword });
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await doHashValidation(oldPassword, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid old password" });
    }

    existingUser.password = await doHash(newPassword, salt);
    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: `Password update failed: ${error}` });
  }
};

export const signout = async (req, res) => {
  try {
    res.clearCookie("Authorization", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ success: true, message: "Signout successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: `Signout failed: ${error}` });
  }
};
