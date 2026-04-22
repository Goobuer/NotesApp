
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const accessToken = localStorage.getItem("accessToken");

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="logo">📓</span>
          <span className="brand-text">Notes & Tasks</span>
        </Link>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          type="button"
        >
          <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
          <span className={`hamburger-line ${menuOpen ? "hide" : ""}`}></span>
          <span className={`hamburger-line ${menuOpen ? "open-reverse" : ""}`}></span>
        </button>

        <div className={`nav-links${menuOpen ? " open" : ""}`}>
          {accessToken ? (
            <>
              <Link
                to="/dashboard"
                className={`nav-link${isActive("/dashboard") ? " active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                ✓ Dashboard
              </Link>
              <Link
                to="/account"
                className={`nav-link${isActive("/account") ? " active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                👤 Account
              </Link>
            </>
          ) : (
            <Link
              to="/dashboard"
              className={`nav-link${isActive("/dashboard") ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              ✓ Dashboard
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
