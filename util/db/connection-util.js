const mysql = require("mysql2/promise");
const { snakeToCamelCaseObj } = require("../format");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "app-data",
  waitForConnections: true,
  connectionLimit: 10, // Set connection limit
});

async function executeQuery(query, values) {
  let connection;
  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query(query, values);

    return rows.map((row) => snakeToCamelCaseObj(row));
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  executeQuery,
};
