import express from "express"

import { postSignin, postSignup } from "../controllers/authControllers.js"


const router = express.Router();

router.post("/signup",postSignup);
router.post("/signin",postSignin)

export default router;