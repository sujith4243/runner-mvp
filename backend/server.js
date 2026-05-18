require("dotenv").config();

const express = require("express");

const cors = require("cors");

const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());

app.use(express.json());

const supabase = createClient(

  process.env.SUPABASE_URL,

  process.env.SUPABASE_KEY

);

app.get("/", (req, res) => {

  res.send("Runner Results API is running");

});

app.get("/results", async (req, res) => {

  const { data, error } = await supabase

    .from("results")

    .select("*")

    .order("event_year", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);

});

app.get("/search", async (req, res) => {

  const query = req.query.name || "";

  const { data, error } = await supabase

    .from("results")

    .select("*")

    .or(

      `runner_name.ilike.%${query}%,bib_number.ilike.%${query}%,event_year.ilike.%${query}%,distance.ilike.%${query}%,event_name.ilike.%${query}%`

    )

    .order("event_year", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Backend running on port ${PORT}`);

});