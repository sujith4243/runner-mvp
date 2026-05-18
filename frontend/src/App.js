import { useState } from "react";
import "./App.css";

function App() {
  const [searchName, setSearchName] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (searchName.trim() === "") {
      setResults([]);
      setSearched(false);
      return;
    }

    fetch(`http://localhost:5000/search?name=${encodeURIComponent(searchName)}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
        setSearched(true);
      })
      .catch((err) => console.error("Search error:", err));
  };

  return (
    <div className="app">
      <h1>Runner Results Portal</h1>

      <div className="search-card">
        <h2>Search Runner</h2>
        <p>Search runner results imported from the official Melbourne Marathon results.</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter runner name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      {searched && results.length === 0 && (
        <p className="no-results">No runner found.</p>
      )}

      {results.length > 0 && (
        <div className="results-section">
          <h2>Search Results</h2>

          {results.map((runner) => (
            <div className="result-card" key={runner.id}>
              <div className="card-header">
                <div>
                  <h3>{runner.runner_name}</h3>
                  <p>
                    {runner.event_name} • {runner.event_year} •{" "}
                    {runner.event_location}
                  </p>
                </div>

                <div className="bib-badge">
                  Bib #{runner.bib_number || "N/A"}
                </div>
              </div>

              <div className="details-grid">
                <div>
                  <span>Distance</span>
                  <strong>{runner.distance || "N/A"}</strong>
                </div>

                <div>
                  <span>Finish Time</span>
                  <strong>{runner.finish_time || "N/A"}</strong>
                </div>

                <div>
                  <span>Overall Rank</span>
                  <strong>{runner.overall_rank || "N/A"}</strong>
                </div>

                <div>
                  <span>Gender Rank</span>
                  <strong>{runner.gender_rank || "N/A"}</strong>
                </div>

                <div>
                  <span>Category Rank</span>
                  <strong>{runner.category_rank || "N/A"}</strong>
                </div>

                <div>
                  <span>Gender</span>
                  <strong>{runner.gender || "N/A"}</strong>
                </div>
              </div>

              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;