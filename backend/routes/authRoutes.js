import express from "express";
import bcrypt from "bcryptjs";
import pool from "../database/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
//Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [existingUsers] = await pool.query(
      "select* from users where email=?",
      [email]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "USer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "insert into users (name, email, password) values (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.json({ message: "User successfully registered" });
  } catch (err) {
    console.error("Signup error: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("select * from users where email=?", [
      email,
    ]);
    // console.log("User found in database: ", rows);
    if (rows.length === 0) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log("Password match status: ", isMatch);
    if (!isMatch) {
      // console.log("Password wrong");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    // console.log(token);

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ message: "Acees denied. No token provided." });
  }
  //
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

router.get("/me", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "select id, name, email from users where id=? ",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: rows[0] });
  } catch (error) {
    console.log("Error fetching user: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default router;
