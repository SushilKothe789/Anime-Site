import { useNavigate } from "react-router-dom";
import "./AnimeCard.css";

const AnimeCard = ({ anime }) => {
  const navigate = useNavigate();

  const animeId = anime?.id;

  const animeName =
    anime?.title || "Unknown Anime";

  const image =
    anime?.poster || "/placeholder.jpg";

  const latestEpisode =
    anime?.is_sub || "N/A";

  const rating =
    anime?.score || "N/A";

  const handleClick = () => {
    if (animeId) {
      navigate(`/anime/${animeId}`);
    }
  };

  return (
    <div
      className="anime-card"
      onClick={handleClick}
    >
      <div className="anime-image-container">

        <img
          src={image}
          alt={animeName}
          className="anime-image"
          loading="lazy"
          decoding="async"
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
          Rating: {rating}★
        </p>

      </div>
    </div>
  );
};

export default AnimeCard;