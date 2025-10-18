import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { acceptOtpCodeSchema, signinSchema, signupSchema } from "../middlewares/validator.js";
import { doHash, doHashValidation } from "../utils/hashing.js";
import transporter from "../middlewares/sendMail.js";

export const postSignup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signupSchema.validate({ email, password });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User already exists !" });
    }
    const hashedPassword = await doHash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    const result = await newUser.save();
    result.password = undefined;
    res.status(201).json({
      success: true,
      message: "Your account account has been created successfully",
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: `Signup Failed ${error}` });
  }
};

export const postSignin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signinSchema.validate({ email, password });
    if (error) {
      res
        .status(401)
        .json({ success: false, message: error.details[0].message });
      console.log(error);
    }
    const existingUser = await User.findOne({ email }).select("password");
    if (!existingUser) {
      res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
    const result = await doHashValidation(password, existingUser.password);

    if (!result) {
      res.status(401).json({
        success: false,
        message: "Invalid Credential",
      });
    }
    const payload = {
      user: {
        id: existingUser._id,
      },
    };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret);
    res
      .cookie("Authorization", "Bearer" + token, {
        expires: new Date(Date.now() + 8 + 60 * 60 * 1000),
        httpOnly: process.env.NODE_ENV === "production",
      })
      .json({ success: true,token, message: "Signin Successfull" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: `Signup Failed ${error}` });
  }
};

export const postOtpVerificationSend = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res
        .status(404)
        .json({ success: false, message: "Email is required" });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not exists" });
    }
    if (existingUser.verified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000);

    await transporter.sendMail({
      from: process.env.NODE_MAILER_EMAIL,
      to: existingUser.email,
      subject: "Verification Code",
      html: "<h1>" + otpCode + "</h1>",
    });
    existingUser.verificationCode = otpCode;
    existingUser.verificationCodeValidation = Date.now();
    await existingUser.save();
    res
      .status(201)
      .json({ success: true, message: "OTP code send to your email" });
  } catch (error) {
     console.log(error);
    res.status(500).json({ success: false, message: `Signup Failed ${error}` });
  }
};

export const signout = async (req, res) => {
  res
    .clearCookie("Authorization")
    .status(200)
    .json({ success: true, message: "Signout Successfull" });
};

export const verifyVerificationCode = async(req,res) =>{
  const {email,providedCode} = req.body;
  try {
    const {error,value} =  acceptOtpCodeSchema.validate({email,providedCode});
    if(error){
      res.status(400).json({success:false,message:error.details[0].message});
    }
    const codeValue = providedCode.toString();
    const existingUser = await User.findOne({email}).select("verificationCode,verificationCodeValidation");
    if(existingUser.verified){
      res.status(400).json({success:true,message:"Your email already verified"});
    }
    if(!existingUser.verified || existingUser.verificationCodeValidation){
      res.status(400).json({success:true,message:"Your email already verified"});
    }
  } catch (error) {
    
  }
}
