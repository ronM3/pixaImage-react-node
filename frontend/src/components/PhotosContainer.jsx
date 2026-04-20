import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPhotos, goToPrevPage, goToNextPage } from "../redux/features/photos/photosAction";
import { LoadingSpinner } from "./LoadingSpinner";
import ButtonsContainer from "./ButtonsContainer";
import "../assets/styles/photosContainer.css";
import PhotoLightbox from "./PhotoLightbox";
import ImageCard from "./ImageCard";
import CategoryChips from "./CategoryChips";

export const PhotosContainer = () => {
  const { data, loading, error, currentPage, currentCategory } = useSelector(
    (state) => state.photosState
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPhotos());
  }, []);

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
        <p>Error: {error}</p>
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
