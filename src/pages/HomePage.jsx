
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Navbar from "../components/Navbar";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000";

const HomePage = () => {
    const navigate = useNavigate();

    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRecentAnime = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/recent-anime`
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch anime: ${response.status}`
                    );
                }

                const data = await response.json();

                console.log("Recent Anime:", data);

                const animeData = Array.isArray(data)
                    ? data
                    : data?.data || [];

                setAnimeList(animeData);
            } catch (err) {
                console.error("Recent anime error:", err);

                setError("Failed to load recent anime");
            } finally {
                setLoading(false);
            }
        };

        fetchRecentAnime();
    }, []);

    if (loading) {
        return (
            <div className="home-page">
                <Navbar />

                <div className="loading">
                    Loading latest anime...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="home-page">
                <Navbar />

                <div className="error">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="home-page">

            <Navbar />

            {/* LATEST ANIME */}
            <section className="latest-anime-section">

                <div className="section-header">
                    <h1>Latest Episodes</h1>

                    <button
                        className="view-all-btn"
                        onClick={() => navigate("/anime")}
                    >
                        View All
                    </button>
                </div>

                {animeList.length === 0 ? (
                    <div className="no-anime">
                        No anime available.
                    </div>
                ) : (
                    <div className="anime-grid">

                        {animeList.map((anime, index) => {

                            const animeId =
                                anime.id ||
                                anime._id ||
                                anime.slug;

                            const animeName =
                                anime.title ||
                                anime.name ||
                                anime.anime_name ||
                                "Unknown Anime";

                            const image =
                                anime.image ||
                                anime.poster ||
                                anime.cover ||
                                anime.thumbnail ||
                                "/placeholder.jpg";

                            const latestEpisode =
                                anime.is_sub ||
                                anime.alternative ||
                                "N/A";
                            const rating = 
                                anime.score ||
                                "N/A";
                            return (
                                <div
                                    className="anime-card"
                                    key={animeId || index}
                                    onClick={() => {
                                        if (animeId) {
                                            navigate(
                                                `/anime/${animeId}`
                                            );
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter" &&
                                            animeId
                                        ) {
                                            navigate(
                                                `/anime/${animeId}`
                                            );
                                        }
                                    }}
                                >
                                    <div className="anime-image-container">

                                        <img
                                            src={image}
                                            alt={animeName}
                                            className="anime-image"
                                            loading="lazy"
                                        />

                                        <span className="episode-badge">
                                            EP {latestEpisode}
                                        </span>

                                    </div>

                                    <div className="anime-info">

                                        <h2 title={animeName}>
                                            {animeName}
                                        </h2>

                                        <p>
                                            Rating:
                                            <span>
                                                {rating}
                                            </span>
                                        </p>

                                    </div>
                                </div>
                            );
                        })}

                    </div>
                )}

            </section>

        </div>
    );
};

export default HomePage;
