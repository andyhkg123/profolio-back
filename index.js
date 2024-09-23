import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import registerRoute from "./routes/auth.js";
import postRoute from "./routes/posts.js";
import cookieParser from "cookie-parser";
import getProjects from "./routes/projects.js";

const port = 8080;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.listen(port, () => {
  console.log(`listening to port http://localhost:${port}/`);
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
