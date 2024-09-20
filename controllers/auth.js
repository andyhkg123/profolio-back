import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res
      .status(400)
      .json({ error: "All fields (username, email, password) are required" });
  }

  const checkUserQuery =
    "SELECT * FROM profolio.users WHERE email = ? OR password = ?";

  db.query(checkUserQuery, [email, password], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (data.length) {
      return res.status(409).json({ error: "User email already existed" });
    }

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    const insertUser =
      "INSERT INTO profolio.users (fullname,email , password) VALUES (?,?,?)";
    db.query(insertUser, [fullname, email, hash], (err, data) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.status(201).json({ message: "user has been created" });
    });
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  const checkUserLogin = "SELECT * FROM profolio.users WHERE email = ?";

  db.query(checkUserLogin, [email], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    console.log(req.body.password);

    if (!data.length) {
      return res.status(404).json({ message: "user not found" });
    }

    if (data.length) {
      const checkPassword = bcrypt.compareSync(password, data[0].password);
      if (!checkPassword) {
        return res.status(401).json({ error: "incorrect password" });
      } else {
        const token = jwt.sign({ id: data[0].email }, "jwtkey");
        const { password, ...other } = data[0];
        res
          .cookie("access_token", token)
          .status(200)
          .json({
            ...other,
            message: "User logged in",
          });
      }
    }
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out");
};
