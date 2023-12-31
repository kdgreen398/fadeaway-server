const mysql = require("mysql2/promise");
import { snakeToCamelCaseObj } from "./format";
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

export async function executeSelectQuery(query: string, values: Array<any>) {
  let connection;
  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query(query, values);

    return rows.map((row: Object) => snakeToCamelCaseObj(row));
  } catch (error) {
    logger.error("Error executing select query: " + error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

export async function executeNonSelectQuery(query: string, values: Array<any>) {
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
