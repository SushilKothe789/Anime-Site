import "./AnimeCardSkeleton.css";

const AnimeCardSkeleton = () => {
  return (
    <div className="anime-card skeleton-card">

      {/* Poster */}
      <div className="anime-image-container skeleton-image">

        <div className="skeleton-episode-badge"></div>

      </div>


      {/* Anime information */}
      <div className="anime-info">

        <div className="skeleton-title"></div>

        <div className="skeleton-rating"></div>

      </div>

    </div>
  );
};

export default AnimeCardSkeleton;