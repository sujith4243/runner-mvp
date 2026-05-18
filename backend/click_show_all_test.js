const { chromium } = require("playwright");

async function main() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://australianoutbackmarathon.com/previous-race-results/", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  await page.waitForTimeout(3000);

  const showAllButtons = page.getByText("show all participants");

  const count = await showAllButtons.count();
  console.log("Show all buttons found:", count);

  for (let i = 0; i < count; i++) {
    try {
      await showAllButtons.nth(i).click();
      await page.waitForTimeout(1000);
      console.log("Clicked button:", i + 1);
    } catch (err) {
      console.log("Could not click button:", i + 1);
    }
  }

  const text = await page.locator("body").innerText();

  console.log("Contains Miriam SEIWALD:", text.includes("Miriam SEIWALD"));
  console.log("Contains Grace TAME:", text.includes("Grace TAME"));
  console.log("Contains Toby O'BRIEN:", text.includes("Toby O'BRIEN"));

  await browser.close();
}

main().catch((err) => console.error(err.message));