import express from "express";
import { getPosts, addPost, verifyToken } from "../controllers/posts.js";

const router = express.Router();

router.get("/", getPosts);

router.post("/addpost", verifyToken, addPost);

export default router;
