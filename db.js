import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "127.0.0.2",
  user: "root",
  password: "password",
  database: "profolio",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});
