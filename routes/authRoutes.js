import express from "express"

import { userAuth } from "../middlewares/userAuth.js";
import { postChangePassword, postOtpVerificationSend, postSignin, postSignup, signout, verifyVerificationCode } from "../controllers/authControllers.js"

const router = express.Router();

router.post("/signup",postSignup);
router.post("/signin",postSignin);
router.patch("/send-verification-code",postOtpVerificationSend);
router.patch("/verify-verification-code",verifyVerificationCode);
router.patch("/change-password",userAuth,postChangePassword);
router.post("/signout",userAuth,signout);

export default router;