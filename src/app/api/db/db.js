import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query(sql, params) {
  const [results] = await db.execute(sql, params);
  return results;
}

export async function simpleQuery(sql) {
  const [results] = await db.query(sql);
  return results;
}

export default db;
