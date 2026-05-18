const { chromium } = require("playwright");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./runner_results.db");

const SOURCE = {
  url: "https://www.multisportaustralia.com.au/races/melbourne-marathon-2025/events/1/",
  event_name: "Nike Melbourne Marathon",
  event_year: "2025",
  distance: "42.2 km",
  event_location: "Melbourne",
};

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

async function main() {
  await setupDatabase();

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(SOURCE.url, {
    waitUntil: "networkidle",
    timeout: 60000,
  });

  console.log("Page loaded:", await page.title());

  const bodyText = await page.locator("body").innerText();

  console.log("Checking page content...");
  console.log(bodyText.slice(0, 500));

  const rows = await page.locator("table tbody tr").evaluateAll((trs) => {
    return trs.map((tr) => {
      const cells = Array.from(tr.querySelectorAll("td")).map((td) =>
        td.innerText.trim()
      );
      return cells;
    });
  });

  console.log("Table rows found:", rows.length);

  let imported = 0;

  for (const cells of rows) {
    if (cells.length < 4) continue;

    const rowText = cells.join(" ");

    const bibMatch = rowText.match(/#?(\d{3,6})/);
    const timeMatch = rowText.match(/\b\d{1,2}:\d{2}:\d{2}\b/);

    const runnerName = cells.find((c) =>
      /[A-Za-z]/.test(c)
    );

    const overallRank = parseInt(cells[0]);

    if (!runnerName || !timeMatch || isNaN(overallRank)) continue;

    const runner = {
      runner_name: runnerName.replace(/#\d+/g, "").trim(),
      event_name: SOURCE.event_name,
      event_year: SOURCE.event_year,
      distance: SOURCE.distance,
      finish_time: timeMatch[0],
      bib_number: bibMatch ? bibMatch[1] : "",
      overall_rank: overallRank,
      gender_rank: null,
      category_rank: null,
      gender: "",
      event_location: SOURCE.event_location,
      source_url: SOURCE.url,
    };

    await insertRunner(runner);
    imported++;
  }

  console.log(`Imported ${imported} runner records.`);

  await browser.close();
  db.close();
}

main().catch((err) => {
  console.error("Import failed:", err.message);
  db.close();
});