const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();

const API_URL =
  "https://my-aus-1.raceresult.com/346907/results/list?key=d6815a84269466964627fdba02731d63&listname=02-Results%7CResults&page=results&contest=0&r=leaders&l=10000&openedGroups=%7B%7D&term=";

const db = new sqlite3.Database("./runner_results.db");

function distanceFromContest(contest) {
  if (contest === "Marathon") return "42.2 km";
  if (contest === "Half Marathon") return "21.1 km";
  if (contest === "11 km") return "11 km";
  if (contest === "6 km") return "6 km";
  return contest;
}

function cleanGender(groupKey) {
  if (groupKey.includes("Female")) return "Female";
  if (groupKey.includes("Male")) return "Male";
  return "";
}

function setupDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("DROP TABLE IF EXISTS results");
      db.run(
        `
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
          category TEXT,
          event_location TEXT,
          source_url TEXT
        )
        `,
        (err) => (err ? reject(err) : resolve())
      );
    });
  });
}

function insertRunner(runner) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO results (
        runner_name, event_name, event_year, distance, finish_time,
        bib_number, overall_rank, gender_rank, category_rank,
        gender, category, event_location, source_url
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        runner.runner_name,
        runner.event_name,
        runner.event_year,
        runner.distance,
        runner.finish_time,
        runner.bib_number,
        runner.overall_rank,
        runner.gender_rank,
        runner.category_rank,
        runner.gender,
        runner.category,
        runner.event_location,
        runner.source_url,
      ],
      (err) => (err ? reject(err) : resolve())
    );
  });
}

async function main() {
  await setupDatabase();

  const response = await axios.get(API_URL);
  const data = response.data.data;

  const runners = [];
  const seen = new Set();

  for (const contestKey of Object.keys(data)) {
    const contestName = contestKey.replace(/^#\d+_/, "");

    for (const genderKey of Object.keys(data[contestKey])) {
      const gender = cleanGender(genderKey);
      const rows = data[contestKey][genderKey];

      for (const row of rows) {
        if (!Array.isArray(row) || row.length < 11) continue;

        const rankRaw = row[2];
        const bib = row[3];
        const name = row[4];
        const time = row[10];

        if (!name || !bib || !time) continue;

        const rank =
          rankRaw === "DNS" || rankRaw === "DNF"
            ? null
            : Number(String(rankRaw).replace(".", ""));

        const runner = {
          runner_name: name,
          event_name: "Australian Outback Marathon",
          event_year: "2025",
          distance: distanceFromContest(contestName),
          finish_time: time,
          bib_number: bib,
          overall_rank: rank,
          gender_rank: rank,
          category_rank: rank,
          gender,
          category: contestName,
          event_location: "Yulara, NT",
          source_url: "https://my.raceresult.com/346907/results",
        };

        const key = `${runner.bib_number}-${runner.runner_name}-${runner.distance}`;
        if (!seen.has(key)) {
          seen.add(key);
          runners.push(runner);
        }
      }
    }
  }

  for (const runner of runners) {
    await insertRunner(runner);
  }

  console.log(`Imported ${runners.length} records from RaceResult API.`);
  console.log("Sample:", runners.slice(0, 10));

  db.close();
}

main().catch((err) => {
  console.error("Import failed:", err.message);
  db.close();
});