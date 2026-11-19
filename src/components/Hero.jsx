import { Link } from 'react-router-dom';

// Hero section, based on the group leader's design (heading, tagline, illustration,
// two buttons). Changes: local SVG instead of hotlinked photos, accessible colours,
// and the buttons now open the report form with the right type pre-selected.
export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-text">
        <h1 id="hero-title">🎒 UCU Lost &amp; Found</h1>
        <p>Lost something? Found something? We help you find it fast.</p>
        <div className="hero-actions">
          <Link className="btn primary" to="/report?type=lost">Report lost item</Link>
          <Link className="btn accent" to="/report?type=found">Report found item</Link>
        </div>
      </div>
      <svg className="hero-art" viewBox="0 0 200 200" role="img" aria-label="Illustration of a backpack">
        <rect x="50" y="60" width="100" height="115" rx="30" fill="#1a237e" />
        <path d="M75 62 C75 30 125 30 125 62" fill="none" stroke="#1a237e" strokeWidth="10" />
        <rect x="68" y="115" width="64" height="40" rx="10" fill="#ff9800" />
        <rect x="88" y="128" width="24" height="6" rx="3" fill="#1a237e" />
        <rect x="75" y="75" width="50" height="22" rx="8" fill="#3949ab" />
      </svg>
    </section>
  );
}
