const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "app-data",
  waitForConnections: true,
  connectionLimit: 10, // Set connection limit
});

async function executeQuery(query) {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("connected to pool");
    const [rows] = await connection.query(query);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool, whether the query succeeds or fails
      console.log("connection released");
    }
  }
}

module.exports = {
  executeQuery,
};
