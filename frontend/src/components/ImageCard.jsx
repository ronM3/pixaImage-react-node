import { useState } from "react";
import PropTypes from "prop-types";
import "../assets/styles/imageCard.css";

const ImageCard = ({ photo, handlePhotoClick }) => {
  const [loaded, setLoaded] = useState(false);

  const handleClick = (event) => {
    event.stopPropagation();
    handlePhotoClick(photo);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick(event);
    }
  };

  const aspectRatio =
    photo.imageWidth && photo.imageHeight
      ? `${photo.imageWidth} / ${photo.imageHeight}`
      : "4 / 3";

  return (
    <article
      className="photo-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View photo by ${photo.user}${photo.tags ? `: ${photo.tags}` : ""}`}
    >
      <div className="photo-card__media" style={{ aspectRatio }}>
        {photo.previewURL && (
          <img
            src={photo.previewURL}
            alt=""
            aria-hidden="true"
            className={`photo-card__placeholder ${loaded ? "is-hidden" : ""}`}
          />
        )}
        <img
          src={photo.webformatURL || photo.largeImageURL}
          alt={photo.tags || `Photo by ${photo.user}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`photo-card__img ${loaded ? "is-loaded" : ""}`}
        />
        <div className="photo-card__overlay" aria-hidden="true">
          <div className="photo-card__meta">
            <span className="photo-card__user">{photo.user}</span>
            {photo.tags && (
              <span className="photo-card__tags">{photo.tags.split(",")[0].trim()}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

ImageCard.propTypes = {
  photo: PropTypes.shape({
    imageWidth: PropTypes.number,
    imageHeight: PropTypes.number,
    previewURL: PropTypes.string,
    webformatURL: PropTypes.string,
    largeImageURL: PropTypes.string,
    user: PropTypes.string,
    tags: PropTypes.string,
  }).isRequired,
  handlePhotoClick: PropTypes.func.isRequired,
};

export default ImageCard;
