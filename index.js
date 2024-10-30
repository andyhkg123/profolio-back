import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import registerRoute from "./routes/auth.js";
import postRoute from "./routes/posts.js";
import cookieParser from "cookie-parser";
import getProjects from "./routes/projects.js";

const PORT = process.env.PORT || 8080;

const app = express();
const corsOptions = {
  origin: "https://profolio-front-2v.vercel.app", // Replace with your frontend URL
  credentials: true, // Allow credentials (cookies) to be sent with requests
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/`);
});

app.get("/", (req, res) => {
  res.send("Hello from Vercel!");
});

app.use("/api/auth", registerRoute);

app.use("/api/posts", postRoute);

app.use("/api/projects", getProjects);
// Query one row from a table
// const query = "SELECT * FROM posts LIMIT 1";
// connection.query(query, (err, results) => {
//   if (err) {
//     console.error("Error executing query:", err);
//     return;
//   }
//   console.log("Query result:", results[0]);
// });
export default app;
