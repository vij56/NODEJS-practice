import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const authorization = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer"))
		return res.status(401).json({ msg: "invalid Authentication" });
	const token = authHeader.split(" ")[1];
	// console.log("=>", token);
	await jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
		// console.log("===>", decodedToken);
		if (err) {
			return res.status(401).json({ msg: "invalid token" });
		}
		await User.findById(decodedToken.user_id)
			.then(() => {
				req.user = decodedToken;
				// console.log("=====>", req.user);
				next();
			})
			.catch(err => {
				res.status(401).json({ err: err.message });
			});
	});
};

export { authorization };
