// Database connection configuration
import mysql from "mysql2";

// Define connection config
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "CourseSphere",
  connectTimeout: 10000, // 10 seconds
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  queueLimit: 0, // unlimited queueing
};

// Log configuration for debugging (except password)
console.log("DB Config:", {
  ...dbConfig,
  password: dbConfig.password ? "********" : "(none)",
});

// Create connection
let db = mysql.createConnection(dbConfig);

// Handle connection
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);

    // Log connection details (for debugging only - remove in production)
    console.log("Connection attempted to:", {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
    });

    // In production, you might want to implement a reconnection strategy here
    // For now, we'll just log the error
    return;
  }
  console.log("Connected to the MySQL database");
});

// Add error handler for unexpected disconnects
db.on("error", (err) => {
  console.error("Database error:", err);

  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.error("Database connection was closed. Attempting to reconnect...");

    // Attempt to reconnect
    db = mysql.createConnection(dbConfig);

    db.connect((connErr) => {
      if (connErr) {
        console.error("Reconnection failed:", connErr.stack);
        return;
      }
      console.log("Reconnected to the MySQL database");
    });
  }
});

export default db;
