const mysql = require("mysql2/promise");
const { snakeToCamelCaseObj } = require("./format");
const logger = require("./logger");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "app-data",
  waitForConnections: true,
  connectionLimit: 10, // Set connection limit
});

async function executeSelectQuery(query, values) {
  let connection;
  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query(query, values);

    return rows.map((row) => snakeToCamelCaseObj(row));
  } catch (error) {
    logger.error("Error executing select query: " + error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function executeNonSelectQuery(query, values) {
  let connection;
  try {
    connection = await pool.getConnection();

    await connection.query(query, values);
  } catch (error) {
    console.error("Error executing insert query:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  executeSelectQuery,
  executeNonSelectQuery,
};
