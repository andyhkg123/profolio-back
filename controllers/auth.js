import { client } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// export const register = (req, res) => {
//   const { fullname, email, password } = req.body;

//   if (!fullname || !email || !password) {
//     return res
//       .status(400)
//       .json({ error: "All fields (username, email, password) are required" });
//   }

//   const checkUserQuery =
//     "SELECT * FROM profolio.users WHERE email = ? OR password = ?";

//   db.query(checkUserQuery, [email, password], (err, data) => {
//     if (err) {
//       console.error("Database query error:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//     if (data.length) {
//       return res.status(409).json({ error: "User email already existed" });
//     }

//     var salt = bcrypt.genSaltSync(10);
//     var hash = bcrypt.hashSync(password, salt);

//     const insertUser =
//       "INSERT INTO profolio.users (fullname,email , password) VALUES (?,?,?)";
//     db.query(insertUser, [fullname, email, hash], (err, data) => {
//       if (err) {
//         console.error("Database query error:", err);
//         return res.status(500).json({ error: "Internal server error" });
//       }
//       return res.status(201).json({ message: "user has been created" });
//     });
//   });
// };

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

// export const login = (req, res) => {
//   const { email, password } = req.body;

//   const checkUserLogin = "SELECT * FROM profolio.users WHERE email = ?";

//   db.query(checkUserLogin, [email], (err, data) => {
//     if (err) {
//       console.error("Database query error:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//     console.log(req.body.password);

//     if (!data.length) {
//       return res.status(404).json({ message: "user not found" });
//     }

//     if (data.length) {
//       const checkPassword = bcrypt.compareSync(password, data[0].password);
//       if (!checkPassword) {
//         return res.status(401).json({ error: "incorrect password" });
//       } else {
//         const token = jwt.sign({ id: data[0].email }, "jwtkey");
//         const { password, ...other } = data[0];
//         res
//           .cookie("access_token", token)
//           .status(200)
//           .json({
//             ...other,
//             message: "User logged in",
//           });
//       }
//     }
//   });
// };

export const login = async (req, res) => {
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

    const token = jwt.sign({ id: user.email }, "jwtkey");
    const { password: userPassword, ...other } = user;

    res
      .cookie("access_token", token, {
        httpOnly: false, // Prevent access via JavaScript
        secure: process.env.NODE_ENV === "production", // Only set Secure in production
        sameSite: "None", // Allow cross-site cookies
      })
      .status(200)
      .json({
        ...other,
        message: "User logged in",
      });
  } catch (err) {
    console.error("Database query error:", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
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
