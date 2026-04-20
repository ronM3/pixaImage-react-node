import PropTypes from "prop-types";
import "../assets/styles/buttonsContainer.css";
import { useSelector } from "react-redux";

const ButtonsContainer = ({ handlePrevPage, handleNextPage }) => {
  const { data, currentPage } = useSelector((state) => state.photosState);
  const totalPages = data?.totalPages || 1;
  const page = currentPage || 1;

  return (
    <nav className="pagination" aria-label="Photo pagination">
      <button
        type="button"
        className="pagination__btn"
        disabled={!data?.hasPrevPage}
        onClick={handlePrevPage}
        aria-label="Previous page"
      >
        <svg
          width="14"
          height="14"
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
        <span>Prev</span>
      </button>

      <span className="pagination__indicator" aria-live="polite">
        <span className="pagination__current">{page}</span>
        <span className="pagination__sep">/</span>
        <span className="pagination__total">{totalPages}</span>
      </span>

      <button
        type="button"
        className="pagination__btn"
        disabled={!data?.hasNextPage}
        onClick={handleNextPage}
        aria-label="Next page"
      >
        <span>Next</span>
        <svg
          width="14"
          height="14"
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
    </nav>
  );
};

ButtonsContainer.propTypes = {
  handlePrevPage: PropTypes.func.isRequired,
  handleNextPage: PropTypes.func.isRequired,
};

export default ButtonsContainer;
