import { client } from "../db.js";
import jwt from "jsonwebtoken";

// import jwt from "jsonwebtoken";

// export const getPosts = (req, res) => {
//   const q = "SELECT * FROM profolio.blog"; ////  if cat is not selected then choose all posts

//   db.query(q, (err, data) => {
//     if (err) return res.status(500).send(err);
//     console.log(data);
//     return res.status(200).json(data);
//   });
// };

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

// export const addPost = (req, res) => {
//   const { fullname_blog, title, content } = req.body;

//   const token = req.cookies.access_token;
//   console.log(token);
//   if (!token) return res.status(401).json("Not authenticated!");

//   jwt.verify(token, "jwtkey", (err, userInfo) => {
//     if (err) return res.status(403).json("Token is not valid!");

//     console.log(userInfo.id);
//     const q =
//       "INSERT INTO profolio.blog(`title`, `content`, `email_blog`, `fullname_blog`) VALUES (?)";

//     const values = [
//       req.body.title,
//       req.body.content,
//       userInfo.id,
//       req.body.fullname_blog,
//     ];

//     console.log(values);

//     db.query(q, [values], (err, data) => {
//       if (err) return res.status(500).json(err);
//       return res.json("Post has been created.");
//     });
//   });
// };

export const addPost = async (req, res) => {
  const { fullname_blog, title, content } = req.body;

  const token = req.cookies.access_token;
  console.log(token);
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", async (err, userInfo) => {
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
