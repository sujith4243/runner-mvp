const { chromium } = require("playwright");

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://my.raceresult.com/346907/results", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.waitForTimeout(5000);

  const text = await page.locator("body").innerText();

  console.log("Contains Miriam:", text.includes("Miriam"));
  console.log("Contains Grace:", text.includes("Grace"));
  console.log("Contains Toby:", text.includes("Toby"));
  console.log(text.slice(0, 3000));

  await browser.close();
}

main().catch((err) => console.error(err.message));