import { useSelector, useDispatch } from "react-redux";
import {
  fetchPhotos,
  updateCurrentCategory,
  updateCurrentQuery,
} from "../redux/features/photos/photosAction";
import "../assets/styles/resultsHeader.css";

const ResultsHeader = () => {
  const { data, currentQuery, currentCategory } = useSelector(
    (s) => s.photosState
  );
  const dispatch = useDispatch();

  const total = data?.totalItems || 0;
  const query = currentQuery?.trim();
  const category = currentCategory;

  const handleClear = () => {
    dispatch(updateCurrentQuery(""));
    dispatch(updateCurrentCategory(""));
    dispatch(fetchPhotos("", 1, ""));
  };

  let label;
  if (query && category) {
    label = (
      <>
        <span className="results-header__count">{total.toLocaleString()}</span>{" "}
        results for <span className="results-header__term">&quot;{query}&quot;</span> in{" "}
        <span className="results-header__term">{category}</span>
      </>
    );
  } else if (query) {
    label = (
      <>
        <span className="results-header__count">{total.toLocaleString()}</span>{" "}
        results for <span className="results-header__term">&quot;{query}&quot;</span>
      </>
    );
  } else if (category) {
    label = (
      <>
        <span className="results-header__count">{total.toLocaleString()}</span>{" "}
        photos in <span className="results-header__term">{category}</span>
      </>
    );
  } else {
    return null;
  }

  return (
    <div className="results-header" role="status">
      <p className="results-header__label">{label}</p>
      <button
        type="button"
        className="results-header__clear"
        onClick={handleClear}
      >
        Clear
      </button>
    </div>
  );
};

export default ResultsHeader;
