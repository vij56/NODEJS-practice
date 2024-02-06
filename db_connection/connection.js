import mongoose from "mongoose";

const dbConnection = url => {
	return mongoose.connect(url);
};

export { dbConnection };
