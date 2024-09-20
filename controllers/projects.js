import { db } from "../db.js";

// import jwt from "jsonwebtoken";

export const getProjects = (req, res) => {
  const q = `SELECT * FROM profolio.projects where idprojects = ${req.params.id}`;
  db.query(q, (err, data) => {
    if (err) {
      return res.status(500).json(err); // Handle the error appropriately
    }
    console.log(data);
    return res.status(200).json(data[0]); // Assuming you want a single post
  });
};
