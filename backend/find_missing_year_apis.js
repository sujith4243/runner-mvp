const { chromium } = require("playwright");

const EVENTS = [
  { year: "2024", eventId: "300713" },
  { year: "2021", eventId: "132024" },
  { year: "2019", eventId: "102319" },
  { year: "2018", eventId: "78376" },
  { year: "2017", eventId: "58288" },
  { year: "2016", eventId: "42099" }
];

async function checkEvent(event) {
  console.log("\n==============================");
  console.log(`Checking ${event.year} - ${event.eventId}`);
  console.log("==============================");

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const foundUrls = [];

  page.on("response", async (response) => {
    const url = response.url();

    if (
      url.includes(`/${event.eventId}/`) ||
      url.includes("results/list") ||
      url.includes("RRPublish")
    ) {
      console.log("RESPONSE:", response.status(), url);

      if (url.includes("results/list") && url.includes("key=")) {
        foundUrls.push(url.replace(/l=\d+/, "l=10000"));
      }
    }
  });

  await page.goto(`https://my.raceresult.com/${event.eventId}/results`, {
    waitUntil: "domcontentloaded",
    timeout: 60000
  });

  await page.waitForTimeout(10000);

  const text = await page.locator("body").innerText();

  console.log("Page title:", await page.title());
  console.log("Text sample:");
  console.log(text.slice(0, 1000));

  if (foundUrls.length > 0) {
    console.log("FOUND API URLS:");
    foundUrls.forEach((u) => console.log(u));
  } else {
    console.log("NO API URL FOUND");
  }

  await browser.close();
}

async function main() {
  for (const event of EVENTS) {
    await checkEvent(event);
  }
}

main().catch((err) => console.error(err.message));