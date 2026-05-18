const axios = require("axios");
const cheerio = require("cheerio");

const SOURCE_URL =
  "https://australianoutbackmarathon.com/previous-race-results/";

async function main() {
  const response = await axios.get(SOURCE_URL);
  const $ = cheerio.load(response.data);

  const text = $("body").text();

  const name = "Miriam SEIWALD";

  console.log("Contains Miriam SEIWALD:", text.includes(name));

  const index = text.indexOf("Miriam");

  if (index !== -1) {
    console.log(text.slice(index - 300, index + 500));
  } else {
    console.log("Miriam not found in fetched page text.");
  }
}

main();