const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const csv = require("csv-parser");

const db = new sqlite3.Database("./runner_results.db");

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS results");

  db.run(`
    CREATE TABLE results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      runner_name TEXT,
      event_name TEXT,
      event_year TEXT,
      distance TEXT,
      finish_time TEXT,
      bib_number TEXT,
      overall_rank INTEGER,
      gender_rank INTEGER,
      category_rank INTEGER,
      gender TEXT,
      event_location TEXT,
      source_url TEXT
    )
  `);

  fs.createReadStream("./data/melbourne_2025_results.csv")
    .pipe(csv())
    .on("data", (row) => {
      db.run(
        `
        INSERT INTO results (
          runner_name,
          event_name,
          event_year,
          distance,
          finish_time,
          bib_number,
          overall_rank,
          gender_rank,
          category_rank,
          gender,
          event_location,
          source_url
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          row.runner_name,
          row.event_name,
          row.event_year,
          row.distance,
          row.finish_time,
          row.bib_number,
          Number(row.overall_rank),
          Number(row.gender_rank),
          Number(row.category_rank),
          row.gender,
          row.event_location,
          row.source_url,
        ]
      );
    })
    .on("end", () => {
      console.log("Runner data imported successfully.");
      db.close();
    });
});