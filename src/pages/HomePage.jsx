import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Navbar from "../components/Navbar/Navbar";
import AnimeCardSkeleton from "../components/AnimeCardSkeleton/AnimeCardSkeleton";
import AnimeCard from "../components/AnimeCard/AnimeCard";
import Pagination from "../components/Pagination/Pagination";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const HomePage = () => {
  const navigate = useNavigate();

  const [animeList, setAnimeList] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecentAnime = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/recent-anime?page=${page}&per_page=24`,
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch anime: ${response.status}`);
        }

        const data = await response.json();

        console.log("Recent Anime:", data);

        const animeData = Array.isArray(data) ? data : data?.data || [];

        setAnimeList(animeData);
      } catch (err) {
        console.error("Recent anime error:", err);

        setError("Failed to load recent anime");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAnime();
  }, [page]);

  const toTop = ()=>{
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const changePage = (newPage) => {
    if (newPage < 1) return;

    setPage(newPage);
    toTop();
  };

  if (error) {
    return (
      <div className="home-page">
        <Navbar />

        <div className="homepage-status error">{error}</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Navbar />

      <section className="latest-anime-section">
        <div className="section-header">
          <h1>Latest Episodes</h1>

          <button className="view-all-btn" onClick={() => navigate("/anime")}>
            View All
          </button>
        </div>

        {loading ? (
          <div className="anime-grid">
            {Array.from({ length: 24 }).map((_, index) => (
              <AnimeCardSkeleton key={index} />
            ))}
          </div>
        ) : animeList.length === 0 ? (
          <div className="no-anime">No anime available.</div>
        ) : (
          <>
            <div className="anime-grid">
              {animeList.map((anime) => (
                <AnimeCard
                  key={anime.id}
                  anime={anime}
                />
              ))}
            </div>

            {/* PAGINATION */}
              
            <Pagination
              page={page}
              onPageChange={changePage}
            />
            
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage;
