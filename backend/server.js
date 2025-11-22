const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

// ===== BASE DE DATOS =====
const db = new sqlite3.Database("./games.db");

// Crear tablas si no existen
db.run(`
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    year TEXT,
    company TEXT,
    mode TEXT,
    duration TEXT,
    image TEXT,
    review TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER,
    text TEXT,
    date TEXT,
    FOREIGN KEY (game_id) REFERENCES games(id)
  )
`);

// ===== ENDPOINTS =====

// Obtener todos los juegos
app.get("/games", (req, res) => {
  db.all("SELECT * FROM games", [], (err, rows) => {
    res.json(rows);
  });
});

// Crear juego
app.post("/games", (req, res) => {
  const g = req.body;
  db.run(
    `INSERT INTO games (title, year, company, mode, duration, image, review)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [g.title, g.year, g.company, g.mode, g.duration, g.image, g.review],
    function () {
      res.json({ id: this.lastID });
    }
  );
});

// Eliminar juego
app.delete("/games/:id", (req, res) => {
  db.run("DELETE FROM games WHERE id=?", req.params.id);
  db.run("DELETE FROM reviews WHERE game_id=?", req.params.id);
  res.json({ status: "deleted" });
});

// Obtener reseñas de un juego
app.get("/reviews/:gameId", (req, res) => {
  db.all("SELECT * FROM reviews WHERE game_id=?", req.params.gameId, (err, rows) => {
    res.json(rows);
  });
});

// Añadir reseña
app.post("/reviews/:gameId", (req, res) => {
  const { text } = req.body;
  db.run(
    `INSERT INTO reviews (game_id, text, date)
     VALUES (?, ?, ?)`,
    [req.params.gameId, text, new Date().toLocaleString()],
    function () {
      res.json({ id: this.lastID });
    }
  );
});

app.listen(3000, () => console.log("Backend corriendo en http://localhost:3000"));
