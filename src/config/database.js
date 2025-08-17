require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  port: process.env.MYSQL_ADDON_PORT || 3306,
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
  maxIdle: 10,
  idleTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Kiểm tra kết nối
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Lỗi kết nối MySQL:", err);
    process.exit(1);
  }
  console.log("✅ Đã kết nối MySQL qua pool!");
  connection.release();
});

module.exports = pool;
