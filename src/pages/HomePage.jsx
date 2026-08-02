import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const navigate = useNavigate();
  const [animeList, setAnimeList] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // Fetch recent anime
  useEffect(() => {
    const fetchRecentAnime = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/recent-anime");

        if (!response.ok) {
          throw new Error("Failed to fetch anime");
        }

        const data = await response.json();

        console.log("Recent Anime:", data);

        const animeData = data.data || (Array.isArray(data) ? data : []);

        setAnimeList(animeData);
      } catch (err) {
        console.error(err);
        setError("Failed to load recent anime");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAnime();
  }, []);

  if (loading) {
    return (
      <div className="homepage-status">
        <p>Loading latest anime...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="homepage-status error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      <Navbar/>
      {/* =========================
          SECTION 1: LATEST ANIME
      ========================== */}

      <div className="section-header">
        <h1>Latest Episodes</h1>

        <button className="view-all-btn">View All</button>
      </div>

      <div className="anime-grid">
        {animeList.map((anime, index) => {
          const animeId = anime.id || anime._id || anime.slug;

          const animeName =
            anime.title || anime.name || anime.anime_name || "Unknown Anime";

          const image =
            anime.image || anime.poster || anime.cover || anime.thumbnail;

          const latestEpisode =
            anime.latest_episode ||
            anime.episode_number ||
            anime.episode ||
            anime.is_sub ||
            "N/A";

          return (
            <div
              className="anime-card"
              key={animeId || index}
              onClick={() => navigate(`/anime/${animeId}`)}
              // onClick={() => fetchAnimeDetails(animeId)}
              // onClick={() => {
              //   console.log("Card clicked");
              //   <Episode />;
              // }}
            >
              <div className="anime-image-container">
                <img src={image} alt={animeName} className="anime-image" />

                <span className="episode-badge">EP {latestEpisode}</span>
              </div>

              <div className="anime-info">
                <h2 title={animeName}>{animeName}</h2>

                <p>
                  Latest Episode: <span>{latestEpisode}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
