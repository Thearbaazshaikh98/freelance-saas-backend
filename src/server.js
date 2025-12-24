import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

app.listen(5000, "0.0.0.0", () => {
    console.log(`Server running 🚀 on port ${PORT}`);
  });
};

startServer();
