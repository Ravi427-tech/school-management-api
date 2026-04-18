const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.get("SELECT ACOS(0.5) as test", (err, row) => {
    if (err) console.error(err.message);
    else console.log("MATH WORKS:", row.test);
  });
});
