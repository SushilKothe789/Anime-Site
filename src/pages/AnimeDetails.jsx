import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./AnimeDetails.css";

const AnimeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/series/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch anime details");
        }

        const data = await response.json();

        const animeData = data.data.anime;
        const episodeData = data.data.episodes;

        setAnime(animeData);
        setEpisodes(episodeData);

        // Latest episode by default
        if (episodeData.length > 0) {
          setSelectedEpisode(
            episodeData[episodeData.length - 1]
          );
        }
      } catch (error) {
        console.error(error);
        setError("Failed to load anime details");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="details-status">
        Loading anime details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-status error">
        {error}
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="details-status">
        Anime not found
      </div>
    );
  }

  const videoUrl =
    selectedEpisode?.embed_url?.sub ||
    selectedEpisode?.embed_url?.dub ||
    "";

  return (
    <div className="anime-details-page">

      {/* 1. NAVBAR */}

      <Navbar />


      {/* 2. ANIME NAME + CURRENT EPISODE */}

      <section className="watch-section">

        <div className="watch-header">
          <div>
            <h1>{anime.title}</h1>

            <p>
              Now Playing • Episode{" "}
              <strong>
                {selectedEpisode?.number}
              </strong>
            </p>
          </div>
        </div>


        {/* VIDEO PLAYER */}

        <div className="player-container">

          {videoUrl ? (
            <iframe
              key={videoUrl}
              src={videoUrl}
              title={`${anime.title} Episode ${selectedEpisode?.number}`}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              allowFullScreen
            />
          ) : (
            <div className="no-video">
              Video not available
            </div>
          )}

        </div>

      </section>


      {/* 3. ALL AVAILABLE EPISODES */}

      <section className="episodes-section">

        <div className="section-heading">
          <h2>Episodes</h2>

          <span>
            {episodes.length} Episodes
          </span>
        </div>

        <div className="episodes-grid">

          {episodes.map((episode) => {

            const isActive =
              selectedEpisode?.id === episode.id;

            return (
              <button
                key={episode.id}
                className={`episode-button ${
                  isActive
                    ? "active-episode"
                    : ""
                }`}
                onClick={() => {
                  setSelectedEpisode(episode);

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                Episode {episode.number}
              </button>
            );
          })}

        </div>

      </section>


      {/* 4. SHORT DESCRIPTION */}

      <section className="description-section">

        <p>
          {anime.description ||
            "No description available."}
        </p>

        <button
          className="full-details-btn"
          onClick={() =>
            navigate(`/anime/${id}/details`)
          }
        >
          Show More
          <span>→</span>
        </button>

      </section>

    </div>
  );
};

export default AnimeDetails;