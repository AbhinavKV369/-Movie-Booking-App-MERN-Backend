import User from "../models/User.js";
import { signinSchema, signupSchema } from "../middlewares/validator.js";
import { doHash, doHashValidation } from "../utils/hashing.js";

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
    89
    const existingUser = await User.findOne({ email }).select('password');
    if (!existingUser) {
      res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
    const result = await doHashValidation(password,existingUser.password);

    if(!result){
      res.status(401).json({
        success:false,
        message: "Invalid Credential"
      });
    }

    res.status(201).json({success:true,message:"Signin Successfull"})
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: `Signup Failed ${error}` });
  }
};
