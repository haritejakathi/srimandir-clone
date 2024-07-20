const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      date TEXT,
      puja TEXT
    )`);
  }
});

// API Endpoints
app.get('/api/bookings', (req, res) => {
  db.all('SELECT * FROM bookings', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

app.post('/api/bookings', (req, res) => {
  const { name, date, puja } = req.body;
  db.run(`INSERT INTO bookings (name, date, puja) VALUES (?, ?, ?)`,
    [name, date, puja],
    function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: { id: this.lastID, name, date, puja }
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
