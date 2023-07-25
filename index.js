const express = require('express');
const app = express();
require('dotenv/config');
const PORT = process.env.PORT || 8000;
const { Pool } = require('pg');
const cors = require('cors');
const pool = new Pool({
  connectionString: process.env.ELEPHANT_SQL_CONNECTION_STRING,
});

//app.use(cors())
app.use(express.json());

app.get('/api/movies', (req, res) => {
  pool
    .query('SELECT * FROM movies;')
    .then((data) => {
      console.log(data);
      res.json(data.rows);
    })
    .catch((e) => req.status(500).json({ message: e.message }));
});
app.get('/api/movies/:id', (req, res) => {});
app.post('/api/movies', (req, res) => {});
app.put('/api/movies/:id', (req, res) => {});
app.delete('/api/movies/:id', (req, res) => {});

app.listen(PORT, () => `SERVER IS UP ON PORT ${PORT}`);
