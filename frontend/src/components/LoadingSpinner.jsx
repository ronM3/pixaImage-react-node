import "../assets/styles/loadingSpinner.css";

// Fixed aspect ratios for visual variety in the skeleton grid
const SKELETON_RATIOS = [
  "3 / 4",
  "4 / 3",
  "1 / 1",
  "4 / 5",
  "3 / 2",
  "4 / 3",
  "2 / 3",
  "3 / 4",
  "4 / 3",
];

export const LoadingSpinner = () => {
  return (
    <div className="skeleton-grid" aria-label="Loading photos" aria-busy="true">
      {SKELETON_RATIOS.map((ratio, i) => (
        <div key={i} className="skeleton-card" style={{ aspectRatio: ratio }} />
      ))}
    </div>
  );
};
