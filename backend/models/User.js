// const mongoose = require("mongoose");
// import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { off } from "process";

const dbPath = path.join(process.cwd(), "database.json");

//Read data from JSON file
const readDB = () => {
  try {
    return JSON.parse(fs.readFileSync(dbPath, "utf8"));
  } catch (error) {
    return { users: [] };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

//to find a user by email

export const findUserByEmail = (email) => {
  const db = readDB();
  return db.users.find((user) => user.email === email);
};

// to create a new user
export const createUser = async (name, email, password) => {
  let db = readDB();
  if (findUserByEmail(email)) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), name, email, password: hashedPassword };

  db.users.push(newUser);
  writeDB();

  return newUser;
};

// to verify user login

export const validateUser = async (email, password) => {
  const user = findUserByEmail(email);
  if (!user) return null;

  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid ? user : null;
};

// export const User = () => {
//   const UserSchema = new mongoose.Schema({
//     name: String,
//     email: { type: String, unique: true },
//     password: String,
//   });
// };

// module.exports = mongoose.model("User", UserSchema);

// export default User;
