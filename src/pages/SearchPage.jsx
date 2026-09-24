import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./SearchPage.css";
import AnimeCard from "../components/AnimeCard/AnimeCard.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q")?.trim() || "";

  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const searchAnime = async () => {
      if (!query) {
        setAnime([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/search?q=${encodeURIComponent(query)}&page=1&per_page=24`,
        );

        if (!response.ok) {
          throw new Error("Failed to search anime");
        }

        const data = await response.json();

        setAnime(data?.data || []);
      } catch (error) {
        console.error("Search error:", error);

        setError("Failed to search anime");
      } finally {
        setLoading(false);
      }
    };

    searchAnime();
  }, [query]);

  return (
    <main className="search-page">
      <div className="search-header">
        <Navbar />

        <h1>Search Results</h1>

        {query && (
          <p>
            Results for:
            <strong> "{query}"</strong>
          </p>
        )}
      </div>

      {loading && <div className="search-message">Searching...</div>}

      {error && <div className="search-message error">{error}</div>}

      {!loading && !error && query && anime.length === 0 && (
        <div className="search-message">No anime found for "{query}"</div>
      )}

      {!loading && anime.length > 0 && (
        <div className="anime-grid">
          {anime.map((item) => (
            <AnimeCard key={item.id} anime={item} />
          ))}
        </div>
      )}
    </main>
  );
};

export default SearchPage;
