import express from "express"

import { postOtpVerification, postSignin, postSignup, signout } from "../controllers/authControllers.js"

const router = express.Router();

router.post("/signup",postSignup);
router.post("/signin",postSignin);
router.patch("/verify-otp",postOtpVerification);
router.post("/signout",signout);

export default router;