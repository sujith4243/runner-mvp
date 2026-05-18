const axios = require("axios");

const URL =
  "https://my-aus-1.raceresult.com/252524/results/list?key=7507443406b2d05b049bd9a5325d6fe3&listname=Online%7COnline%20Results_NoPhotos&page=results&contest=0&r=leaders&l=10000&openedGroups=%7B%7D&term=";

async function main() {
  const response = await axios.get(URL);

  console.log("Top-level keys:", Object.keys(response.data));
  console.log("Data keys:", response.data.data ? Object.keys(response.data.data) : "NO DATA");

  console.log(JSON.stringify(response.data).slice(0, 5000));
}

main().catch(err => console.error(err.message));