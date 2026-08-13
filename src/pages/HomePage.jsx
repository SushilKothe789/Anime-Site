import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Navbar from "../components/Navbar";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

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
          `${API_URL}/api/recent-anime?page=${page}&per_page=24`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch anime: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("Recent Anime:", data);

        const animeData =
          Array.isArray(data)
            ? data
            : data?.data || [];

        setAnimeList(animeData);

      } catch (err) {
        console.error(
          "Recent anime error:",
          err
        );

        setError(
          "Failed to load recent anime"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchRecentAnime();
  }, [page]);


  const changePage = (newPage) => {
    if (newPage < 1) return;

    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


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

      <section className="latest-anime-section">

        <div className="section-header">

          <h1>
            Latest Episodes
          </h1>

          <button
            className="view-all-btn"
            onClick={() =>
              navigate("/anime")
            }
          >
            View All
          </button>

        </div>


        {loading ? (

          <div className="loading">
            Loading latest anime...
          </div>

        ) : animeList.length === 0 ? (

          <div className="no-anime">
            No anime available.
          </div>

        ) : (

          <>
            <div className="anime-grid">

              {animeList.map(
                (anime, index) => {

                  const animeId =
                    anime.id;

                  const animeName =
                    anime.title ||
                    "Unknown Anime";

                  const image =
                    anime.poster ||
                    "/placeholder.jpg";

                    const latestEpisode = 
                    anime.is_sub ||
                    "N/A";
                  const rating =
                    anime.score || "N/A";

                  return (
                    <div
                      className="anime-card"
                      key={
                        animeId || index
                      }
                      onClick={() => {
                        if (animeId) {
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
                          loading={
                            index < 6
                              ? "eager"
                              : "lazy"
                          }
                          decoding="async"
                        />

                        <span className="episode-badge">
                            EP {latestEpisode}
                        </span>

                      </div>


                      <div className="anime-info">

                        <h2
                          title={animeName}
                        >
                          {animeName}
                        </h2>

                        <p>
                          Rating: {rating}★
                        </p>

                      </div>

                    </div>
                  );
                }
              )}

            </div>


            {/* PAGINATION */}

            <div className="pagination">

              <button
                disabled={page === 1}
                onClick={() =>
                  changePage(page - 1)
                }
              >
                &lt;
              </button>


              {page > 1 && (
                <button
                  onClick={() =>
                    changePage(page - 1)
                  }
                >
                  {page - 1}
                </button>
              )}


              <button className="active-page">
                {page}
              </button>


              <button
                onClick={() =>
                  changePage(page + 1)
                }
              >
                {page + 1}
              </button>


              <button
                onClick={() =>
                  changePage(page + 1)
                }
              >
                &gt;
              </button>

            </div>

          </>
        )}

      </section>

    </div>
  );
};

export default HomePage;