const axios = require("axios");
const cheerio = require("cheerio");

const SOURCE_URL =
  "https://australianoutbackmarathon.com/previous-race-results/";

async function main() {
  const response = await axios.get(SOURCE_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    },
  });

  const $ = cheerio.load(response.data);
  const bodyText = $("body").text();

  console.log("Status:", response.status);
  console.log("Title:", $("title").text());
  console.log("Text length:", bodyText.length);
  console.log("First 3000 characters:");
  console.log(bodyText.slice(0, 3000));

  console.log("\nAll links:");
  $("a").each((i, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr("href");
    if (text || href) {
      console.log(`${text} -> ${href}`);
    }
  });
}

main().catch((err) => {
  console.error("Debug failed:", err.message);
});