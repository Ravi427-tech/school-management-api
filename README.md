# 🎓 School Management API

A RESTful API built with **Node.js**, **Express.js**, and **MySQL** to manage school data. Supports adding schools and listing them sorted by proximity using the Haversine formula.

---

## 📁 Project Structure

```
school-management-api/
├── src/
│   ├── app.js                     # Entry point — Express server setup
│   ├── config/
│   │   └── db.js                  # MySQL connection pool + table init
│   ├── controllers/
│   │   └── schoolController.js    # Business logic + Haversine distance
│   ├── middleware/
│   │   └── validate.js            # Joi validation middleware
│   └── routes/
│       └── schoolRoutes.js        # Route definitions
├── postman/
│   └── School_Management_API.postman_collection.json
├── database.sql                   # DB setup + optional seed data
├── .env.example                   # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Prerequisites

| Requirement | Version  |
|-------------|----------|
| Node.js     | ≥ 16.x   |
| npm         | ≥ 8.x    |
| MySQL       | ≥ 5.7    |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/school-management-api.git
cd school-management-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up the database
```bash
mysql -u root -p < database.sql
```

### 4. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` with your MySQL credentials:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management
```

### 5. Start the server
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Server runs at: `http://localhost:3000`

---

## 📡 API Reference

### `GET /`
Health check — confirms the server is running.

---

### `POST /addSchool`
Adds a new school to the database.

**Request Body** (`application/json`):
| Field     | Type   | Required | Constraints           |
|-----------|--------|----------|-----------------------|
| name      | string | ✅       | 2–255 characters      |
| address   | string | ✅       | 5–500 characters      |
| latitude  | float  | ✅       | -90 to 90             |
| longitude | float  | ✅       | -180 to 180           |

**Example Request:**
```json
{
  "name": "Delhi Public School",
  "address": "Mathura Road, New Delhi 110025",
  "latitude": 28.5355,
  "longitude": 77.2100
}
```

**Success Response** `201 Created`:
```json
{
  "success": true,
  "message": "School added successfully.",
  "data": {
    "id": 1,
    "name": "Delhi Public School",
    "address": "Mathura Road, New Delhi 110025",
    "latitude": 28.5355,
    "longitude": 77.21
  }
}
```

**Validation Error** `400 Bad Request`:
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    "School name cannot be empty.",
    "Latitude is required."
  ]
}
```

---

### `GET /listSchools`
Returns all schools sorted by distance from the user's location.

**Query Parameters:**
| Parameter | Type  | Required | Description         |
|-----------|-------|----------|---------------------|
| latitude  | float | ✅       | User's latitude     |
| longitude | float | ✅       | User's longitude    |

**Example Request:**
```
GET /listSchools?latitude=28.6139&longitude=77.2090
```

**Success Response** `200 OK`:
```json
{
  "success": true,
  "message": "Schools fetched and sorted by proximity.",
  "user_location": { "latitude": 28.6139, "longitude": 77.209 },
  "total": 2,
  "data": [
    {
      "id": 2,
      "name": "Kendriya Vidyalaya",
      "address": "Sector 8, RK Puram, New Delhi",
      "latitude": 28.5673,
      "longitude": 77.1882,
      "distance_km": 5.43
    },
    {
      "id": 1,
      "name": "Delhi Public School",
      "address": "Mathura Road, New Delhi 110025",
      "latitude": 28.5355,
      "longitude": 77.21,
      "distance_km": 8.71
    }
  ]
}
```

---

## 🧮 Distance Algorithm

Distance is calculated using the **Haversine formula**, which accounts for Earth's curvature:

```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
c = 2 × atan2(√a, √(1−a))
d = R × c          (R = 6371 km)
```

---

## 🗄️ Database Schema

```sql
CREATE TABLE schools (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  address     VARCHAR(500)  NOT NULL,
  latitude    FLOAT(10, 6)  NOT NULL,
  longitude   FLOAT(10, 6)  NOT NULL,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧪 Testing with Postman

1. Open Postman.
2. Click **Import** → select `postman/School_Management_API.postman_collection.json`.
3. Set the `baseUrl` variable to your server URL.
4. Run the included requests.

---

## 🌐 Deployment (Railway / Render / Heroku)

1. Push source to GitHub.
2. Connect your repo to [Railway](https://railway.app) or [Render](https://render.com).
3. Add environment variables from `.env.example` in the dashboard.
4. MySQL: provision a managed MySQL add-on and set `DB_*` vars accordingly.
5. Deploy — the `npm start` command is used automatically.

---

## 📦 Dependencies

| Package   | Purpose                     |
|-----------|-----------------------------|
| express   | Web framework               |
| mysql2    | MySQL client with Promises  |
| dotenv    | Environment variable loader |
| joi       | Schema validation           |
| cors      | Cross-origin support        |
| nodemon   | Dev auto-reload             |
