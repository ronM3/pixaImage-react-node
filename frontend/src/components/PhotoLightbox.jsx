import { useEffect, useCallback, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import "../assets/styles/photoLightbox.css";

const formatNum = (n) => {
  if (n == null) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
};

const PhotoLightbox = ({ photo, onClose, onNavigate }) => {
  const { data } = useSelector((state) => state.photosState);
  const closeButtonRef = useRef(null);

  const items = useMemo(() => data?.items || [], [data]);
  const currentIndex = items.findIndex((p) => p.id === photo?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < items.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev) onNavigate(items[currentIndex - 1]);
  }, [hasPrev, items, currentIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext) onNavigate(items[currentIndex + 1]);
  }, [hasNext, items, currentIndex, onNavigate]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, handlePrev, handleNext]);

  if (!photo) return null;

  const tagList = photo.tags
    ? photo.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photo detail"
      onClick={onClose}
    >
      <button
        ref={closeButtonRef}
        type="button"
        className="lightbox__close"
        onClick={onClose}
        aria-label="Close"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {hasPrev && (
        <button
          type="button"
          className="lightbox__nav lightbox__nav--prev"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Previous photo"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              d="M10 3 L5 8 L10 13"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          className="lightbox__nav lightbox__nav--next"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Next photo"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              d="M6 3 L11 8 L6 13"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <div className="lightbox__stage" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.largeImageURL}
          alt={photo.tags || `Photo by ${photo.user}`}
          className="lightbox__image"
        />

        <div className="lightbox__panel">
          <div className="lightbox__panel-row">
            <div className="lightbox__author">
              <div className="lightbox__avatar" aria-hidden="true">
                {photo.user?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="lightbox__author-text">
                <span className="lightbox__author-name">{photo.user}</span>
                <span className="lightbox__author-label">Photographer</span>
              </div>
            </div>

            <div className="lightbox__stats">
              <div className="lightbox__stat" title="Views">
                <span className="lightbox__stat-value">
                  {formatNum(photo.views)}
                </span>
                <span className="lightbox__stat-label">Views</span>
              </div>
              <div className="lightbox__stat" title="Downloads">
                <span className="lightbox__stat-value">
                  {formatNum(photo.downloads)}
                </span>
                <span className="lightbox__stat-label">Downloads</span>
              </div>
              <div className="lightbox__stat" title="Likes">
                <span className="lightbox__stat-value">
                  {formatNum(photo.likes)}
                </span>
                <span className="lightbox__stat-label">Likes</span>
              </div>
              <div className="lightbox__stat" title="Collections">
                <span className="lightbox__stat-value">
                  {formatNum(photo.collections)}
                </span>
                <span className="lightbox__stat-label">Collections</span>
              </div>
            </div>
          </div>

          {tagList.length > 0 && (
            <div className="lightbox__tags">
              {tagList.map((tag) => (
                <span key={tag} className="lightbox__tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

PhotoLightbox.propTypes = {
  photo: PropTypes.shape({
    id: PropTypes.number,
    largeImageURL: PropTypes.string,
    user: PropTypes.string,
    tags: PropTypes.string,
    views: PropTypes.number,
    downloads: PropTypes.number,
    likes: PropTypes.number,
    collections: PropTypes.number,
  }),
  onClose: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

PhotoLightbox.defaultProps = {
  photo: null,
};

export default PhotoLightbox;
