import { db } from "./db";

const createUsersTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY)`;
};

db.query(sql, (err, result) => {
  console.log("success");
});

createUsersTable();
