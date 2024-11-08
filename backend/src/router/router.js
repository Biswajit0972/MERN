import express from "express";
// import { registerUser } from "../controllers/logic.js";
import { registerUser, Login, getUser } from "../controllers/logic.js";
import { isUserLogin } from "../middleware/auth.js";

const router  = express.Router();

router.route("/signup").post(registerUser);
router.route("/signin").post(Login);
router.route("/getuser").get(isUserLogin, getUser);

export {router}