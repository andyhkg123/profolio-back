import { client } from "../db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { parse } from "cookie";

// import cookieParser from "cookie-parser";

// Load environment variables from .env file
dotenv.config();
const secret = process.env.JWT_SECRET;

export const getPosts = async (req, res) => {
  try {
    await client.connect();
    const database = client.db("profolio");
    const blog = database.collection("blog");
    const posts = await blog.find({}).toArray();
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json(err); // Handle the error appropriately
  } finally {
    await client.close();
  }
};

export const addPost = async (req, res) => {
  const { fullname_blog, title, content } = req.body;

  const token = req.cookies.access_token;
  console.log(token);

  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) {
      console.log("Verification error:", err);
      return res.status(403).json("Token is not valid!");
    }
    console.log("User info:", userInfo.id);

    try {
      await client.connect();
      const database = client.db("profolio");
      const blog = database.collection("blog");
      const newPost = {
        title,
        content,
        email_blog: userInfo.id,
        date: new Date(),
        fullname_blog,
      };
      const result = await blog.insertOne(newPost);

      return res.json("Post has been created.");
    } catch (err) {
      return res.status(500).json(err); // Handle the error appropriately
    } finally {
      await client.close();
    }
  });
};
