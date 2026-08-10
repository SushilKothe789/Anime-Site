
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./AnimeDetails.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";

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
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/series/${id}`
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch anime details: ${response.status}`
                    );
                }

                const data = await response.json();

                const animeData = data?.data?.anime;
                const episodeData = data?.data?.episodes || [];

                if (!animeData) {
                    throw new Error("Anime not found");
                }

                setAnime(animeData);
                setEpisodes(episodeData);

                // Select latest episode by default
                if (episodeData.length > 0) {
                    setSelectedEpisode(
                        episodeData[episodeData.length - 1]
                    );
                } else {
                    setSelectedEpisode(null);
                }
            } catch (error) {
                console.error(
                    "Failed to fetch anime details:",
                    error
                );

                setError("Failed to load anime details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAnimeDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="anime-details-page">
                <Navbar />

                <div className="loading">
                    Loading anime details...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="anime-details-page">
                <Navbar />

                <div className="error">
                    {error}
                </div>
            </div>
        );
    }

    if (!anime) {
        return (
            <div className="anime-details-page">
                <Navbar />

                <div className="error">
                    Anime not found
                </div>
            </div>
        );
    }

    const videoUrl =
        selectedEpisode?.embed_url?.sub ||
        selectedEpisode?.embed_url?.dub ||
        "";

    return (
        <div className="anime-details-page">

            {/* NAVBAR */}
            <Navbar />

            {/* ANIME NAME + CURRENT EPISODE */}
            <section className="watch-section">

                <div className="watch-header">
                    <div>
                        <h1>{anime.title}</h1>

                        <p>
                            Now Playing • Episode{" "}
                            <strong>
                                {selectedEpisode?.number || "N/A"}
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
                            title={`${anime.title} Episode ${selectedEpisode?.number || ""}`}
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

            {/* ALL AVAILABLE EPISODES */}
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

            {/* DESCRIPTION */}
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
