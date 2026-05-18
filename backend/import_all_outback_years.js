const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();

const EVENTS = [
  {
    year: "2025",
    eventId: "346907",
    apiUrls: [
      "https://my-aus-1.raceresult.com/346907/results/list?key=d6815a84269466964627fdba02731d63&listname=02-Results%7CResults&page=results&contest=0&r=leaders&l=10000&openedGroups=%7B%7D&term="
    ]
  },
  {
    year: "2024",
    eventId: "300713",
    apiUrls: [
      "https://my-aus-1.raceresult.com/300713/results/list?key=4a60d130e8489f4539f91dac0e9fefc7&listname=Online%7COnline%20Results&page=results&contest=4&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/300713/results/list?key=4a60d130e8489f4539f91dac0e9fefc7&listname=Online%7COnline%20Results&page=results&contest=3&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/300713/results/list?key=4a60d130e8489f4539f91dac0e9fefc7&listname=Online%7COnline%20Results&page=results&contest=2&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/300713/results/list?key=4a60d130e8489f4539f91dac0e9fefc7&listname=Online%7COnline%20Results&page=results&contest=1&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/300713/results/list?key=4a60d130e8489f4539f91dac0e9fefc7&listname=Online%7COnline%20Results&page=results&contest=5&r=all&l=10000&openedGroups=%7B%7D&term="
    ]
  },
  {
    year: "2023",
    eventId: "252524",
    apiUrls: [
      "https://my-aus-1.raceresult.com/252524/results/list?key=7507443406b2d05b049bd9a5325d6fe3&listname=Online%7COnline%20Results_NoPhotos&page=results&contest=0&r=leaders&l=10000&openedGroups=%7B%7D&term="
    ]
  },
  {
    year: "2022",
    eventId: "210884",
    apiUrls: [
      "https://my-aus-1.raceresult.com/210884/results/list?key=1f5d8b3bcae0baf47654bb1fdf20e9eb&listname=Online%7COnline%20Results_NoPhotos&page=results&contest=0&r=leaders&l=10000&openedGroups=%7B%7D&term="
    ]
  },
  {
    year: "2019",
    eventId: "132024",
    apiUrls: [
      "https://my-aus-1.raceresult.com/132024/results/list?key=040042018a8eee3c731b231a2f653dda&listname=Online%7COnline%20Results_NoPhotos&page=results&contest=1&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/132024/results/list?key=040042018a8eee3c731b231a2f653dda&listname=Online%7COnline%20Results_NoPhotos&page=results&contest=2&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/132024/results/list?key=040042018a8eee3c731b231a2f653dda&listname=Online%7COnline%20Results_NoPhotos&page=results&contest=3&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/132024/results/list?key=040042018a8eee3c731b231a2f653dda&listname=Online%7COnline%20Results_NoPhotos&page=results&contest=4&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/132024/results/list?key=040042018a8eee3c731b231a2f653dda&listname=Online%7COnline%20Results_NoPhotos&page=results&contest=5&r=all&l=10000&openedGroups=%7B%7D&term="
    ]
  },
  {
    year: "2018",
    eventId: "102319",
    apiUrls: [
      "https://my-aus-1.raceresult.com/102319/results/list?key=8a1b9aadd5eb89a580f17b48f783c1c6&listname=Online%7COnline%20Results_NoPhotos&page=results&contest=1&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/102319/results/list?key=8a1b9aadd5eb89a580f17b48f783c1c6&listname=Online%7COnline%20Results_NoPhotos&page=results&contest=2&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/102319/results/list?key=8a1b9aadd5eb89a580f17b48f783c1c6&listname=Online%7COnline%20Results_NoPhotos&page=results&contest=3&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/102319/results/list?key=8a1b9aadd5eb89a580f17b48f783c1c6&listname=Online%7COnline%20Results_NoPhotos&page=results&contest=4&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/102319/results/list?key=8a1b9aadd5eb89a580f17b48f783c1c6&listname=Online%7COnline%20Results_NoPhotos&page=results&contest=5&r=all&l=10000&openedGroups=%7B%7D&term="
    ]
  },
  {
    year: "2017",
    eventId: "78376",
    apiUrls: [
      "https://my-aus-1.raceresult.com/78376/results/list?key=fa4746fe8df902978a1cac2032d8f228&listname=Online%7COnline%20Results_NoPhotos&page=results&contest=1&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/78376/results/list?key=fa4746fe8df902978a1cac2032d8f228&listname=Online%7COnline%20Results_NoPhotos&page=results&contest=2&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/78376/results/list?key=fa4746fe8df902978a1cac2032d8f228&listname=Online%7COnline%20Results_NoPhotos&page=results&contest=3&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/78376/results/list?key=fa4746fe8df902978a1cac2032d8f228&listname=Online%7COnline%20Results_NoPhotos&page=results&contest=4&r=all&l=10000&openedGroups=%7B%7D&term="
    ]
  },
  {
    year: "2016",
    eventId: "58288",
    apiUrls: [
      "https://my-aus-1.raceresult.com/58288/results/list?key=2c736b97231937e114c757e004c3e4fe&listname=Online%7COnline%20Results&page=results&contest=1&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/58288/results/list?key=2c736b97231937e114c757e004c3e4fe&listname=Online%7COnline%20Results&page=results&contest=2&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/58288/results/list?key=2c736b97231937e114c757e004c3e4fe&listname=Online%7COnline%20Results&page=results&contest=3&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/58288/results/list?key=2c736b97231937e114c757e004c3e4fe&listname=Online%7COnline%20Results&page=results&contest=4&r=all&l=10000&openedGroups=%7B%7D&term="
    ]
  },
  {
    year: "2015",
    eventId: "42099",
    apiUrls: [
      "https://my-aus-1.raceresult.com/42099/results/list?key=fdc0d69c9bfeaf1d6de21374c21233eb&listname=Online%7COnline%20Results&page=results&contest=1&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/42099/results/list?key=fdc0d69c9bfeaf1d6de21374c21233eb&listname=Online%7COnline%20Results&page=results&contest=2&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/42099/results/list?key=fdc0d69c9bfeaf1d6de21374c21233eb&listname=Online%7COnline%20Results&page=results&contest=3&r=all&l=10000&openedGroups=%7B%7D&term=",
      "https://my-aus-1.raceresult.com/42099/results/list?key=fdc0d69c9bfeaf1d6de21374c21233eb&listname=Online%7COnline%20Results&page=results&contest=4&r=all&l=10000&openedGroups=%7B%7D&term="
    ]
  }
];

const db = new sqlite3.Database("./runner_results.db");

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
        gender, category, event_location
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
        runner.category,
        runner.event_location,

      ],
      (err) => (err ? reject(err) : resolve())
    );
  });
}

function cleanContestName(key) {
  return String(key).replace(/^#\d+_/, "").trim();
}

function distanceFromContest(contest) {
  const c = String(contest).toLowerCase();

  if (c.includes("half")) return "21.1 km";
  if (c.includes("11")) return "11 km";
  if (c.includes("6")) return "6 km";
  if (c.includes("kids")) return "Kids Marathon";
  if (c.includes("marathon")) return "42.2 km";

  return contest;
}

function findFieldIndex(fields, possibleNames) {
  return fields.findIndex((field) =>
    possibleNames.some((name) =>
      String(field).toLowerCase().includes(String(name).toLowerCase())
    )
  );
}

function extractGender(row) {
  const rowText = JSON.stringify(row).toLowerCase();

  if (
    rowText.includes("female") ||
    rowText.includes("f (") ||
    rowText.includes('"f"')
  ) {
    return "Female";
  }

  if (
    rowText.includes("male") ||
    rowText.includes("m (") ||
    rowText.includes('"m"')
  ) {
    return "Male";
  }

  return "";
}

async function importApiUrl(event, apiUrl) {
  const response = await axios.get(apiUrl);
  const data = response.data.data;
  const fields = response.data.DataFields || [];

  if (!data) return 0;

  const rankIndex = findFieldIndex(fields, [
    "AUTORANKP",
    "AUTORANK.p",
    "OverallRank",
    "TotalRank",
    "OrStatus"
  ]);

  const bibIndex = findFieldIndex(fields, ["DisplayBib", "BIB"]);
  const nameIndex = findFieldIndex(fields, ["DisplayNameOrTeam", "DisplayName"]);
  const timeIndex = findFieldIndex(fields, [
    "TimeOrStatus",
    "withstatus",
    "Official Time",
    "OrStatus([TIME])",
    "TIME",
    "Finish"
  ]);

  if (bibIndex === -1 || nameIndex === -1 || timeIndex === -1) {
    console.log(`${event.year}: missing column indexes`);
    console.log(fields);
    return 0;
  }

  let count = 0;
  const seen = new Set();

  for (const contestKey of Object.keys(data)) {
    const contestName = cleanContestName(contestKey);
    const contestData = data[contestKey];

    let groups = [];

    if (Array.isArray(contestData)) {
      groups = [contestData];
    } else {
      groups = Object.values(contestData);
    }

    for (const rows of groups) {
      if (!Array.isArray(rows)) continue;

      for (const row of rows) {
        if (!Array.isArray(row)) continue;

        const rankRaw = rankIndex >= 0 ? row[rankIndex] : null;
        const bib = row[bibIndex];
        const name = row[nameIndex];
        const time = row[timeIndex];

        if (!name || !bib || !time) continue;

        const rank =
          rankRaw === "DNS" || rankRaw === "DNF" || rankRaw === null
            ? null
            : Number(String(rankRaw).replace(".", ""));

        const runner = {
          runner_name: String(name).trim(),
          event_name: "Australian Outback Marathon",
          event_year: event.year,
          distance: distanceFromContest(contestName),
          finish_time: String(time).trim(),
          bib_number: String(bib).trim(),
          overall_rank: Number.isNaN(rank) ? null : rank,
          gender_rank: Number.isNaN(rank) ? null : rank,
          category_rank: Number.isNaN(rank) ? null : rank,
          gender: extractGender(row),
          category: contestName,
          event_location: "Yulara, NT",
          
        };

        const key = `${event.year}-${runner.bib_number}-${runner.runner_name}-${runner.distance}`;

        if (!seen.has(key)) {
          seen.add(key);
          await insertRunner(runner);
          count++;
        }
      }
    }
  }

  return count;
}

async function main() {
  await setupDatabase();

  let total = 0;

  for (const event of EVENTS) {
    console.log(`Importing ${event.year}...`);

    let yearTotal = 0;

    for (const apiUrl of event.apiUrls) {
      try {
        const count = await importApiUrl(event, apiUrl);
        yearTotal += count;
      } catch (err) {
        console.log(`${event.year}: failed URL - ${err.message}`);
      }
    }

    console.log(`${event.year}: imported ${yearTotal} records`);
    total += yearTotal;
  }

  console.log(`Finished. Total imported records: ${total}`);
  db.close();
}

main();