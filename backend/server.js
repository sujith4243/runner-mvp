const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./runner_results.db");

app.get("/results", (req, res) => {
  db.all("SELECT * FROM results ORDER BY runner_name ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/search", (req, res) => {
  const name = req.query.name || "";

  db.all(
    `
    SELECT * FROM results
    WHERE runner_name LIKE ?
       OR bib_number LIKE ?
       OR event_name LIKE ?
       OR distance LIKE ?
    ORDER BY runner_name ASC
    `,
    [`%${name}%`, `%${name}%`, `%${name}%`, `%${name}%`],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.listen(5000, () => {
  console.log("Backend running at http://localhost:5000");
});