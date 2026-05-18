require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

function escapeCSV(value) {
  if (value === null || value === undefined) return "";
  return `"${String(value).replace(/"/g, '""')}"`;
}

async function fetchAllResults() {
  let allData = [];
  let from = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from("results")
      .select("*")
      .order("event_year", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) break;

    allData = allData.concat(data);

    if (data.length < pageSize) break;

    from += pageSize;
  }

  return allData;
}

async function main() {
  console.log("Fetching data from Supabase...");

  const data = await fetchAllResults();

  console.log(`Fetched ${data.length} records`);

  const headers = [
    "runner_name",
    "event_name",
    "event_year",
    "distance",
    "finish_time",
    "bib_number",
    "overall_rank",
    "gender_rank",
    "category_rank",
    "gender",
    "category",
    "event_location"
  ];

  const csvRows = [
    headers.join(","),
    ...data.map(row =>
      headers.map(header => escapeCSV(row[header])).join(",")
    )
  ];

  const csvContent = csvRows.join("\n");

  console.log("Uploading CSV to Supabase Storage...");

  const { error: uploadError } = await supabase.storage
    .from("runner-data")
    .upload("outback_results.csv", csvContent, {
      contentType: "text/csv",
      upsert: true
    });

  if (uploadError) {
    console.log("Upload error:", uploadError.message);
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from("runner-data")
    .getPublicUrl("outback_results.csv");

  console.log("CSV uploaded successfully!");
  console.log("Public CSV URL:");
  console.log(publicUrlData.publicUrl);
}

main();