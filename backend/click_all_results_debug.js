const { chromium } = require("playwright");

const EVENT = { year: "2016", eventId: "42099" };

async function getAllResultUrls() {
  const browser = await chromium.launch({ headless: false });

  const apiUrls = [];

  for (let i = 0; i < 5; i++) {
    const page = await browser.newPage();

    page.on("response", async (response) => {
      const url = response.url();

      if (url.includes(`/${EVENT.eventId}/results/list`) && url.includes("key=")) {
        const fullUrl = url.replace(/l=\d+/, "l=10000");

        if (!apiUrls.includes(fullUrl)) {
          apiUrls.push(fullUrl);
          console.log("FOUND API:", fullUrl);
        }
      }
    });

    await page.goto(`https://my.raceresult.com/${EVENT.eventId}/results`, {
      waitUntil: "domcontentloaded",
      timeout: 60000
    });

    await page.waitForTimeout(4000);

    const links = page.getByText("All Results", { exact: true });
    const count = await links.count();

    console.log(`Page reload ${i + 1}: links found = ${count}`);

    if (i < count) {
      console.log(`Clicking link ${i + 1}`);
      await links.nth(i).click({ timeout: 10000 });
      await page.waitForTimeout(5000);
    }

    await page.close();
  }

  await browser.close();

  console.log("\nFINAL API URLS:");
  apiUrls.forEach((url) => console.log(url));
}

getAllResultUrls().catch(err => console.error(err.message));