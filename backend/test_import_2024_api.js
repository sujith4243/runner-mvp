const axios = require("axios");

const URL =
  "https://my-aus-1.raceresult.com/300713/results/list?key=4a60d130e8489f4539f91dac0e9fefc7&listname=Online%7COnline%20Results&page=results&contest=4&r=all&l=10000&openedGroups=%7B%7D&term=";

async function main() {
  const response = await axios.get(URL);

  console.log("Top keys:", Object.keys(response.data));
  console.log("Data keys:", response.data.data ? Object.keys(response.data.data) : "NO DATA");
  console.log("Fields:", response.data.DataFields);

  const text = JSON.stringify(response.data);
  console.log("Length:", text.length);
  console.log("Sample:", text.slice(0, 2000));
}

main().catch(err => console.error(err.message));