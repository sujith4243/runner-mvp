const { chromium } = require("playwright");

const SOURCE_URL = "https://my.raceresult.com/346907/results";

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  page.on("response", async (response) => {
    const url = response.url();

    if (
      url.includes("raceresult") ||
      url.includes("RRPublish") ||
      url.includes("api") ||
      url.includes("result") ||
      url.includes("ajax")
    ) {
      console.log("\nURL:");
      console.log(url);
      console.log("Status:", response.status());

      try {
        const text = await response.text();

        if (
          text.includes("Grace") ||
          text.includes("Miriam") ||
          text.includes("Toby") ||
          text.includes("Bib") ||
          text.includes("Rank")
        ) {
          console.log("FOUND RESULT DATA:");
          console.log(text.slice(0, 1000));
        }
      } catch (err) {
        // ignore non-text responses
      }
    }
  });

  await page.goto(SOURCE_URL, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.waitForTimeout(10000);

  console.log("Finished checking network requests.");

  await browser.close();
}

main().catch((err) => console.error(err.message));