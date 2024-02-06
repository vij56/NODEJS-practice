import { User } from "../models/User.js";

const registerUser = async (req, res) => {
	const { userName, email, password } = req.body;
	if (!userName || !email || !password) {
		return res.status(400).json({ msg: "please provide all fields" });
	}
	try {
		const userAlreadyExists = await User.findOne({ email }).exec();
		if (userAlreadyExists) {
			return res
				.status(400)
				.json({ msg: `${email} is already associated with an account` });
		}
		await User.create({ userName, email, password }).exec();
		res.status(201).json({ msg: "user registered" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const signinUser = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ msg: "please provide all fields" });
	}
	try {
		const userExists = await User.findOne({ email }).select("+password").exec();
		if (!userExists) {
			return res
				.status(401)
				.json({ msg: `account is not accociated with email ${email}` });
		}
		const correctPassword = await userExists.comparePassword(password);
		if (!correctPassword) {
			return res.status(401).json({ msg: "incorrect password" });
		}
		const token = userExists.createJWT();
		res.status(200).json({ token });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getUser = async (req, res) => {
	try {
		// console.log("=>", req.user);
		const user = await User.findOne({ _id: req.user.user_id }).exec();
		res.status(200).json({ user });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const updateUser = async (req, res) => {
	const { isAdmin } = req.body;
	try {
		const user = await User.findByIdAndUpdate(
			{ _id: req.user.user_id },
			{ $set: { isAdmin } },
			{ new: true }
		).exec();
		res.status(200).json({ "updated user": user });
	} catch (error) {
		res.status(500).json({ err: error.message });
	}
};

const deleteUser = async (req, res) => {
	try {
		// doesn't return deleted object so no need to store in variable and send in response
		await User.deleteOne({ _id: req.user.user_id }).exec();
		res.status(200).json({ msg: "user deleted" });
	} catch (error) {
		res.status(500).json({ err: error.message });
	}
};

export { registerUser, signinUser, getUser, updateUser, deleteUser };
