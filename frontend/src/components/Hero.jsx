import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPhotos,
  updateCurrentQuery,
} from "../redux/features/photos/photosAction";
import "../assets/styles/hero.css";

const TRENDING_TAGS = [
  "sunset",
  "ocean",
  "coffee",
  "minimal",
  "mountains",
  "flowers",
];

const Hero = () => {
  const { data, currentCategory } = useSelector((s) => s.photosState);
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const debounceRef = useRef(null);

  // Pick a backdrop from the first available photo with a good aspect ratio
  const backdrop =
    data?.items?.find((p) => p.imageWidth >= p.imageHeight) || data?.items?.[0];
  const backdropUrl = backdrop?.largeImageURL;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(updateCurrentQuery(value));
      dispatch(fetchPhotos(currentCategory, 1, value));
    }, 400);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleTagClick = (tag) => {
    setValue(tag);
    dispatch(updateCurrentQuery(tag));
    dispatch(fetchPhotos(currentCategory, 1, tag));
  };

  return (
    <section className="hero" aria-label="Welcome">
      {backdropUrl && (
        <div
          className="hero__backdrop"
          style={{ backgroundImage: `url(${backdropUrl})` }}
          aria-hidden="true"
        />
      )}
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__content">
        <h1 className="hero__headline">Find your next photo.</h1>
        <p className="hero__sub">
          Free, high-quality images from the Pixabay community.
        </p>

        <div className="hero__search">
          <svg
            className="hero__search-icon"
            width="18"
            height="18"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5 L14 14" strokeLinecap="round" />
          </svg>
          <input
            className="hero__search-input"
            type="search"
            placeholder="Try 'mountain', 'coffee', 'aurora'..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label="Search photos"
          />
        </div>

        <div className="hero__tags">
          {TRENDING_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className="hero__tag"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
