const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
};

const pool = mysql.createPool({
  ...dbConfig,
  database: process.env.DB_NAME || "school_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Tests the database connection and creates the database and table if they don't exist.
 */
const initializeDatabase = async () => {
  try {
    // Phase 1: Connect WITHOUT a specific database to ensure we can create it
    const initConnection = await mysql.createConnection(dbConfig);
    const dbName = process.env.DB_NAME || "school_management";
    
    await initConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`✅ Database '${dbName}' verified/created.`);
    await initConnection.end();

    // Phase 2: Now connect to the pool that specifically targets the database
    const connection = await pool.getConnection();
    console.log("✅ MySQL connected via Pool successfully.");

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS schools (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(255)  NOT NULL,
        address     VARCHAR(500)  NOT NULL,
        latitude    FLOAT(10, 6)  NOT NULL,
        longitude   FLOAT(10, 6)  NOT NULL,
        created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Optional: Auto-insert sample data if table is empty
    const [rows] = await connection.execute("SELECT COUNT(*) as count FROM schools");
    if (rows[0].count === 0) {
      await connection.execute(`
        INSERT INTO schools (name, address, latitude, longitude) VALUES
        ('Delhi Public School', 'Mathura Road, New Delhi 110025', 28.5355, 77.2100),
        ('Kendriya Vidyalaya', 'Sector 8, RK Puram, New Delhi', 28.5673, 77.1882),
        ('St. Xavier High School', 'Park Street, Kolkata 700016', 22.5514, 88.3612),
        ('Bishop Cottons School', 'Residency Road, Bengaluru 560025', 12.9716, 77.5946),
        ('DAV Public School', 'Banjara Hills, Hyderabad 500034', 17.4126, 78.4471)
      `);
      console.log("✅ Seed data inserted into schools table.");
    }

    console.log("✅ Schools table ready.");
    connection.release();
  } catch (err) {
    console.error("❌ Database initialization error:", err.message);
    console.error("👉 Please make sure your MySQL password inside the `.env` file is correct!");
    process.exit(1);
  }
};

module.exports = { pool, initializeDatabase };
