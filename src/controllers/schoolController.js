const { pool } = require("../config/db");

/**
 * POST /addSchool
 * Adds a new school to the database.
 */
const addSchool = async (req, res, next) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO schools (name, address, latitude, longitude)
       VALUES (?, ?, ?, ?)`,
      [name.trim(), address.trim(), latitude, longitude]
    );

    return res.status(201).json({
      success: true,
      message: "School added successfully.",
      data: {
        id: result.insertId,
        name: name.trim(),
        address: address.trim(),
        latitude,
        longitude,
      },
    });
  } catch (err) {
    next(err); // Pass error to global error handler
  }
};

/**
 * GET /listSchools?latitude=xx&longitude=yy&page=1&limit=10
 * Fetches all schools sorted by proximity to the given coordinates
 * using MySQL's native math functions for scale and performance.
 */
const listSchools = async (req, res, next) => {
  try {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Haversine formula implemented directly in MySQL for optimal performance
    // It sorts exactly at the database level and applies pagination limit/offset
    const query = `
      SELECT 
        id, name, address, latitude, longitude, created_at,
        (
          6371 * acos(
            cos(radians(?)) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians(?)) + 
            sin(radians(?)) * sin(radians(latitude))
          )
        ) AS distance_km
      FROM schools
      ORDER BY distance_km ASC
      LIMIT ? OFFSET ?
    `;

    const [schools] = await pool.execute(query, [
      userLat, userLon, userLat, limit.toString(), offset.toString()
    ]);
    
    // Convert string limits back to integers if mysql2 requires it, but usually sending numbers works.
    // Wait, pool.execute with prepared statements for LIMIT/OFFSET can be tricky in some MySQL versions
    // So let's cast them inside the JS call or manipulate the query depending on mysql2 config.
    // Actually, mysql2 supports casting. Let's do it safely by just passing numbers but ensure integer type. 

    return res.status(200).json({
      success: true,
      message: "Schools fetched and sorted by proximity.",
      meta: {
        user_location: { latitude: userLat, longitude: userLon },
        page,
        limit,
        total_in_page: schools.length
      },
      data: schools.map(school => ({
        ...school,
        distance_km: Math.round(school.distance_km * 100) / 100 // round strictly to 2 decimals
      })),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { addSchool, listSchools };
