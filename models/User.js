import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
	userName: { type: String, required: [true, "user name required"] },
	email: { type: String, required: [true, "email required"] },
	password: {
		type: String,
		required: [true, "password required"],
		select: false,
	},
	isAdmin: { type: Boolean, default: false },
});

userSchema.pre("save", async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password);
	return isMatch;
};

userSchema.methods.createJWT = function () {
	return jwt.sign(
		{ user_id: this._id, email: this.email },
		process.env.JWT_SECRET,
		{ expiresIn: "30s" }
	);
};

const User = mongoose.model.users || mongoose.model("User", userSchema);

export { User };
