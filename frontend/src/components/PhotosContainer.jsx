import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPhotos, goToPrevPage, goToNextPage } from "../redux/features/photos/photosAction";
import { LoadingSpinner } from "./LoadingSpinner";
import ButtonsContainer from "./ButtonsContainer";
import "../assets/styles/photosContainer.css";
import PhotoLightbox from "./PhotoLightbox";
import ImageCard from "./ImageCard";
import CategoryChips from "./CategoryChips";
import Hero from "./Hero";
import ResultsHeader from "./ResultsHeader";

export const PhotosContainer = () => {
  const { data, loading, error, currentPage, currentCategory, currentQuery } =
    useSelector((state) => state.photosState);
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const dispatch = useDispatch();
  const hasActiveCategory = Boolean(currentCategory);
  const hasActiveQuery = Boolean(currentQuery?.trim());

  useEffect(() => {
    dispatch(fetchPhotos());
  }, [dispatch]);

  const handlePrevPage = () => {
    dispatch(goToPrevPage(currentCategory, currentPage));
  };

  const handleNextPage = () => {
    dispatch(goToNextPage(currentCategory, currentPage));
  };

  // Modal handle Functions
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedPhoto("");
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setShowModal(true);
  };

  return (
    <section className="photos-container">
      {!hasActiveCategory && !hasActiveQuery && currentPage === 1 && <Hero />}
      {(hasActiveCategory || hasActiveQuery) && <ResultsHeader />}
      <CategoryChips />
      {showModal && selectedPhoto && (
        <PhotoLightbox
          photo={selectedPhoto}
          onClose={handleModalClose}
          onNavigate={(nextPhoto) => setSelectedPhoto(nextPhoto)}
        />
      )}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="photos-error">Error: {error}</p>
      ) : data.items && data.items.length === 0 ? (
        <div className="photos-empty" role="status">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M16 16 L21 21" strokeLinecap="round" />
          </svg>
          <p className="photos-empty__title">No photos found</p>
          <p className="photos-empty__hint">
            Try a different search or category.
          </p>
        </div>
      ) : (
        data.items && (
          <div className="photos-grid">
            {data.items.map((photo) => (
              <ImageCard
                key={photo.id}
                photo={photo}
                handlePhotoClick={handlePhotoClick}
              />
            ))}
          </div>
        )
      )}
      <ButtonsContainer
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
      />
    </section>
  );
};
