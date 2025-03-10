import express from "express";
// import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
// import Connection from "./database/db.js";
import cors from "cors";

// const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 5000;
// dotenv.config();

app.use(cors());
app.use(express.json());

// const USERNAME = process.env.db_USERNAME;
// const PASSWORD = process.env.db_PASSWORD;

// Connection(USERNAME, PASSWORD);
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.error("MongoDB connection error", err));

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
