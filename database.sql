-- ============================================================
-- School Management API  —  Database Setup Script
-- Run this once to create the database and table.
-- ============================================================

CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

CREATE TABLE IF NOT EXISTS schools (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  address     VARCHAR(500)  NOT NULL,
  latitude    FLOAT(10, 6)  NOT NULL,
  longitude   FLOAT(10, 6)  NOT NULL,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Optional: seed data for testing
INSERT INTO schools (name, address, latitude, longitude) VALUES
  ('Delhi Public School', 'Mathura Road, New Delhi 110025', 28.5355, 77.2100),
  ('Kendriya Vidyalaya', 'Sector 8, RK Puram, New Delhi', 28.5673, 77.1882),
  ('St. Xavier High School', 'Park Street, Kolkata 700016', 22.5514, 88.3612),
  ('Bishop Cottons School', 'Residency Road, Bengaluru 560025', 12.9716, 77.5946),
  ('DAV Public School', 'Banjara Hills, Hyderabad 500034', 17.4126, 78.4471);
