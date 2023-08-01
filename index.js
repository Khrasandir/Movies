const express = require('express');
const app = express();
require('dotenv/config');
const PORT = process.env.PORT || 8000;
const { Pool } = require('pg');
const cors = require('cors');
const pool = new Pool({
  connectionString: process.env.ELEPHANT_SQL_CONNECTION_STRING,
});

app.use(cors());
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
app.get('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  const safeValues = [id];
  pool
    .query('SELECT * FROM movies WHERE id=$1;', safeValues)
    .then(({ rowCount, rows }) => {
      if (rowCount === 0) {
        res.status(404).json({ message: `Movie with id ${id} not found!` });
      } else {
        res.json(rows[0]); //rows is always an array of 1 item
      }
    });
});
app.post('/api/movies', (req, res) => {
  const { title, year, director, genre, image, imdb, metascore } = req.body;
  const safeValues = [title, year, director, genre, image, imdb, metascore];
  pool
    .query(
      'INSERT INTO movies (title, year, director, genre, image, imdb, metascore) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
      safeValues
    )
    .then(({ rows }) => {
      console.log(rows);
      res.status(201).json(rows[0]);
    })
    .catch((e) => express.status(500).json({ message: e.message }));
});
app.put('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  const { title, year, director, genre, image, imdb, metascore } = req.body;
  const safeValues = [title, year, director, genre, image, imdb, metascore, id];
  pool
    .query(
      'UPDATE movies SET title = $1, year = $2, director = $3, genre = $4, image = $5, imdb = $6, metascore = $7 WHERE id = $8 RETURNING *;',
      safeValues
    )
    .then(({ rows }) => {
      console.log(rows);
      res.status(202).json(rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});
app.delete('/api/movies/:id', (req, res) => {
  const { id } = req.params;
  const safeValues = [id];
  pool
    .query('DELETE FROM movies WHERE id = $1 RETURNING *;', safeValues)
    .then(({ rows }) => {
      console.log(rows);
      res.json(rows[0]);
    })
    .catch((e) => res.status(500).json({ message: e.message }));
});

app.listen(PORT, () => console.log(`SERVER IS UP ON PORT ${PORT}`));

// CREATE TABLE movies (
//   id serial PRIMARY KEY,
//   title varchar(255),
//   year int,
//   director varchar(255),
//   genre varchar(255),
//   image varchar(500),
//   imdb float,
//   metascore int);
