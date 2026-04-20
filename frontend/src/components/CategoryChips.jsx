import { useDispatch, useSelector } from "react-redux";
import {
  fetchPhotos,
  updateCurrentCategory,
} from "../redux/features/photos/photosAction";
import "../assets/styles/categoryChips.css";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "backgrounds", label: "Backgrounds" },
  { value: "fashion", label: "Fashion" },
  { value: "nature", label: "Nature" },
  { value: "science", label: "Science" },
  { value: "animals", label: "Animals" },
  { value: "education", label: "Education" },
  { value: "feelings", label: "Feelings" },
  { value: "health", label: "Health" },
  { value: "food", label: "Food" },
];

const CategoryChips = () => {
  const { currentCategory } = useSelector((state) => state.photosState);
  const dispatch = useDispatch();
  const activeValue = currentCategory || "";

  const handleSelect = (value) => {
    dispatch(updateCurrentCategory(value));
    dispatch(fetchPhotos(value));
  };

  return (
    <div
      className="category-chips"
      role="tablist"
      aria-label="Filter by category"
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value || "all"}
          type="button"
          role="tab"
          aria-selected={activeValue === cat.value}
          className={`chip ${activeValue === cat.value ? "is-active" : ""}`}
          onClick={() => handleSelect(cat.value)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryChips;
