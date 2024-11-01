import { client } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// const secret = process.env.JWT_SECRET;

const secret = process.env.JWT_SECRET;

export function generateToken(payload) {
  // console.log("JWT_SECRET during generation:", process.env.JWT_SECRET);
  if (!secret) {
    throw new Error("JWT secret is not defined");
  }
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

export const register = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res
      .status(400)
      .json({ error: "All fields (fullname, email, password) are required" });
  }

  try {
    await client.connect();
    const database = client.db("profolio");
    const users = database.collection("users");

    const existingUser = await users.findOne({
      $or: [{ email }, { password }],
    });
    if (existingUser) {
      return res.status(409).json({ error: "User email already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = { fullname, email, password: hash };
    await users.insertOne(newUser);

    return res.status(201).json({ message: "User has been created" });
  } catch (err) {
    console.error("Database query error:", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
};

export const login = async (req, res) => {
  if (req.method === "POST") {
    const { email, password } = req.body;
    try {
      await client.connect();
      const database = client.db("profolio");

      const users = database.collection("users");
      const user = await users.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      const token = generateToken({ id: user.email }, "jwtkey");
      res.cookie("access_token", token, {
        httpOnly: true,
        path: "/",
        sameSite: "Strict",
        secure: true,
        maxAge: 3600 * 1000,
      });

      console.log("Cookie set:", req.cookies.access_token); // Log cookie to check

      return res.status(200).json({ message: "User logged in", user });
    } catch (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export const logout = (req, res) => {
  if (req.method === "POST") {
    res.setHeader(
      "Set-Cookie",
      `access_token=; HttpOnly; expires=Thu, 01 Jan 1970 00:00:00 GMT;`
    );

    res.status(200).json({ message: "User has been logged out" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
