const { chromium } = require("playwright");

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(
    "https://australianoutbackmarathon.com/previous-race-results/",
    {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    }
  );

  const text = await page.locator("body").innerText();

  console.log("Contains Miriam SEIWALD:", text.includes("Miriam SEIWALD"));

  const index = text.indexOf("Miriam");

  if (index !== -1) {
    console.log(text.slice(index - 300, index + 500));
  } else {
    console.log("Miriam not found in browser-rendered page.");
  }

  await browser.close();
}

main().catch((err) => console.error(err.message));