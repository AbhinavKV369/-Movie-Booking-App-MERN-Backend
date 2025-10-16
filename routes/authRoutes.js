import express from "express"

import { postSignin, postSignup, signout } from "../controllers/authControllers.js"


const router = express.Router();

router.post("/signup",postSignup);
router.post("/signin",postSignin);
router.post("/signout",signout);

export default router;