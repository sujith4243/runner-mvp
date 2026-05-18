const { chromium } = require("playwright");
const sqlite3 = require("sqlite3").verbose();

const SOURCE_URL = "https://my.raceresult.com/346907/results";
const db = new sqlite3.Database("./runner_results.db");

function setupDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("DROP TABLE IF EXISTS results", (err) => {
        if (err) return reject(err);

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
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });
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
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

function distanceFromContest(contest) {
  if (contest === "Marathon") return "42.2 km";
  if (contest === "Half Marathon") return "21.1 km";
  if (contest === "11 km") return "11 km";
  if (contest === "6 km") return "6 km";
  if (contest === "Kids Marathon") return "Kids Marathon";
  return contest;
}

async function main() {
  await setupDatabase();

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(SOURCE_URL, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.waitForTimeout(5000);

  const text = await page.locator("body").innerText();

  const lines = text
    .split("\n")
    .map((line) => line.trim().replace(/\s+/g, " "))
    .filter(Boolean);

  let currentContest = "";
  let currentGender = "";

  const contests = ["Marathon", "Half Marathon", "11 km", "6 km", "Kids Marathon"];
  const runners = [];
  const seen = new Set();

  for (const line of lines) {
    if (contests.includes(line)) {
      currentContest = line;
      currentGender = "";
      continue;
    }

    if (line === "Female" || line === "Male") {
      currentGender = line;
      continue;
    }

    const match = line.match(
      /^(DNS|\d+\.)\s+([A-Za-z0-9-]+)\s+(.+?)\s+([A-Z]{3})\s+(DNS|\d{1,2}:\d{2}(?::\d{2})?)$/
    );

    if (!match) continue;
    if (!currentContest || !currentGender) continue;

    const rankRaw = match[1];
    const bibNumber = match[2];
    const runnerName = match[3].trim();
    const finishTime = match[5];

    const rankNumber =
      rankRaw === "DNS" ? null : Number(rankRaw.replace(".", ""));

    const runner = {
      runner_name: runnerName,
      event_name: "Australian Outback Marathon",
      event_year: "2025",
      distance: distanceFromContest(currentContest),
      finish_time: finishTime,
      bib_number: bibNumber,
      overall_rank: rankNumber,
      gender_rank: rankNumber,
      category_rank: rankNumber,
      gender: currentGender,
      category: currentContest,
      event_location: "Yulara, NT",
      source_url: SOURCE_URL,
    };

    const key = `${runner.runner_name}-${runner.bib_number}-${runner.distance}`;

    if (!seen.has(key)) {
      seen.add(key);
      runners.push(runner);
    }
  }

  for (const runner of runners) {
    await insertRunner(runner);
  }

  console.log(`Imported ${runners.length} RaceResult records.`);
  console.log("Sample:", runners.slice(0, 10));

  await browser.close();
  db.close();
}

main().catch((err) => {
  console.error("Import failed:", err.message);
  db.close();
});