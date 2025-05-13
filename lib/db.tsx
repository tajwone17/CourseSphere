import mysql from "mysql2";

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "CourseSphere",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to the MySQL database");

  // Test the connection with a simple query
  //   db.query('SELECT 1 + 1 AS solution', (err, results) => {
  //     if (err) {
  //       console.error('Database test query failed:', err);
  //       return;
  //     }
  //     console.log('Database connection test successful');
  //   });
});

export default db;
