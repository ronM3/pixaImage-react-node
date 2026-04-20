import { useState, useEffect } from "react";
import "../assets/styles/header.css";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header__inner">
        <a className="wordmark" href="/">
          <span className="wordmark__name">pixa</span>
          <span className="wordmark__slash">/</span>
          <span className="wordmark__sub">image</span>
        </a>
        <div className="search">
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <circle
              cx="7"
              cy="7"
              r="4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <line
              x1="10.5"
              y1="10.5"
              x2="14"
              y2="14"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <input
            className="search__input"
            type="search"
            placeholder="Search photos, tags, colors…"
            aria-label="Search photos"
          />
        </div>
        <nav
          className={`nav-links ${isMobileMenuOpen ? "is-open" : ""}`}
          id="navigationLinks"
          aria-label="Primary"
        >
          <ul>
            <li>
              <a href="#" className="nav-links__link">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="nav-links__link">
                Explore
              </a>
            </li>
            <li>
              <a href="#" className="nav-links__link">
                Upload
              </a>
            </li>
            <li>
              <a href="#" className="nav-links__link">
                Contact
              </a>
            </li>
          </ul>
        </nav>
        <button className="theme-toggle" type="button" aria-label="Toggle theme">
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path
              d="M13 9.5 A5 5 0 0 1 6.5 3 A5.5 5.5 0 1 0 13 9.5 Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </button>
        <button
          id="mobileMenuTrigger"
          aria-expanded={isMobileMenuOpen ? "true" : "false"}
          aria-controls="navigationLinks"
          title="Open and Close Navigation"
          onClick={toggleMobileMenu}
          className={`hamburger ${isMobileMenuOpen ? "is-open" : ""}`}
        >
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </button>
      </div>
    </header>
  );
};
export default Header;
