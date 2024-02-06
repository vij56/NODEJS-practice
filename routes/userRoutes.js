import { Router } from "express";
import {
	registerUser,
	signinUser,
	getUser,
	updateUser,
	deleteUser,
} from "../controllers/userController.js";
import { authorization } from "../middlewares/authorization.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/signin").post(signinUser);
router.route("/me").get(authorization, getUser);
router.route("/update").put(authorization, updateUser);
router.route("/delete").delete(authorization, deleteUser);

export default router;
