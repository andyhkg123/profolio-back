import { client } from "../db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import cookieParser from "cookie-parser";

// Load environment variables from .env file
dotenv.config();

export const getPosts = async (req, res) => {
  try {
    await client.connect();
    const database = client.db("profolio");
    const blog = database.collection("blog");
    const posts = await blog.find({}).toArray();
    console.log(posts);
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json(err); // Handle the error appropriately
  } finally {
    await client.close();
  }
};

export const addPost = async (req, res) => {
  const { fullname_blog, title, content } = req.body;

  console.log("Request headers:", req.headers);
  console.log("Cookies:", req.cookies);

  const token = req.cookies.access_token;

  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_SECRET, async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    console.log(userInfo.id);

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

      console.log(result);

      return res.json("Post has been created.");
    } catch (err) {
      return res.status(500).json(err); // Handle the error appropriately
    } finally {
      await client.close();
    }
  });
};
