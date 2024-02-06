import express from "express";
import dotenv from "dotenv";

import userRouter from "./routes/userRoutes.js";
import { dbConnection } from "./db_connection/connection.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRouter);

const connection = async () => {
	await dbConnection(process.env.DB_URL);
	console.log("database connection successful");
	app.listen(PORT, () => {
		console.log(`http://localhost:${PORT}`);
	});
};
connection();
