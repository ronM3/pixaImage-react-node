import "../assets/styles/footer.css";
import MotolaLogo from "../assets/images/motola-logo.svg?react";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span className="site-footer__made">Made by</span>
        <a
          href="https://motoladev.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="site-footer__brand"
          aria-label="Ron Motola - motoladev.com"
        >
          <MotolaLogo className="site-footer__logo" aria-hidden="true" />
        </a>
        <span className="site-footer__dot" aria-hidden="true">&middot;</span>
        <span className="site-footer__meta">&copy; {year}</span>
        <span className="site-footer__dot" aria-hidden="true">&middot;</span>
        <span className="site-footer__meta">
          Photos by{" "}
          <a
            href="https://pixabay.com"
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer__link"
          >
            Pixabay
          </a>
        </span>
      </div>
    </footer>
  );
};
