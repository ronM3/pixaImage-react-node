import { useState, useEffect } from "react";
import "../assets/styles/header.css";

const Header = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof document === "undefined") return "light";
    return document.documentElement.getAttribute("data-theme") || "light";
  });
  const [scrolled, setScrolled] = useState(false);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("pixa-theme", next);
    } catch (e) {
      // Ignore storage failures and keep the in-memory toggle working.
    }
  };

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
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="3" />
              <path
                d="M8 1.5 V3 M8 13 V14.5 M1.5 8 H3 M13 8 H14.5 M3.3 3.3 L4.4 4.4 M11.6 11.6 L12.7 12.7 M3.3 12.7 L4.4 11.6 M11.6 4.4 L12.7 3.3"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M13 9.5 A5 5 0 0 1 6.5 3 A5.5 5.5 0 1 0 13 9.5 Z" />
            </svg>
          )}
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
