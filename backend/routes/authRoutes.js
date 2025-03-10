import fs from "fs";
import path from "path";
import express from "express";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

const router = express.Router();
const dbPath = path.join(process.cwd(), "database.json");
// const JWT_SECRET = process.env.JWT_SECRET;

// Read database from json file

const readDB = () => {
  try {
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
  } catch (error) {
    return { users: [] };
  }
};

//Write data in json file
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

//Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  let db = readDB();

  if (db.users.find((user) => user.email === email)) {
    return res.status(400).json({ message: "User alrerady exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  db.users.push({ id: Date.now(), name, email, password: hashedPassword });

  writeDB(db);
  res.json({ message: "User registered successfully" });
});

//Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let db = readDB();

  const user = db.users.find((user) => user.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({
    message: "Login successful",
    user: { id: user.id, name: user.name, email: user.email },
  });
});

export default router;
