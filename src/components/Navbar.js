
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const accessToken = localStorage.getItem("accessToken");

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        {/* Logo/Brand */}
        <Link to="/" style={styles.brand}>
          <span style={styles.logo}>📓</span>
          <span style={styles.brandText}>Notes & Tasks</span>
        </Link>

        {/* Hamburger Menu Button */}
        <button
          style={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span style={{...styles.hamburgerLine, transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'none'}}></span>
          <span style={{...styles.hamburgerLine, opacity: menuOpen ? 0 : 1}}></span>
          <span style={{...styles.hamburgerLine, transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none'}}></span>
        </button>

        {/* Navigation Links */}
        <div style={{...styles.navLinks, ...(menuOpen ? styles.navLinksOpen : {})}}>
          <Link
            to="/"
            style={{
              ...styles.navLink,
              ...(isActive("/") ? styles.navLinkActive : {})
            }}
            onClick={() => setMenuOpen(false)}
          >
            🏠 Home
          </Link>

          <Link
            to="/dashboard"
            style={{
              ...styles.navLink,
              ...(isActive("/dashboard") ? styles.navLinkActive : {})
            }}
            onClick={() => setMenuOpen(false)}
          >
            ✓ Dashboard
          </Link>

          {accessToken ? (
            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
            >
              🚪 Logout
            </button>
          ) : (
            <Link
              to="/login"
              style={{
                ...styles.navLink,
                ...(isActive("/login") ? styles.navLinkActive : {})
              }}
              onClick={() => setMenuOpen(false)}
            >
              🔐 Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
    color: "white",
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    transition: "all 0.3s ease",
  },
  logo: {
    fontSize: "28px",
  },
  brandText: {
    background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  hamburger: {
    display: "none",
    flexDirection: "column",
    background: "none",
    border: "none",
    cursor: "pointer",
    gap: "6px",
    "@media (max-width: 768px)": {
      display: "flex",
    },
  },
  hamburgerLine: {
    width: "24px",
    height: "3px",
    background: "white",
    borderRadius: "2px",
    transition: "all 0.3s ease",
  },
  navLinks: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    "@media (max-width: 768px)": {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      flexDirection: "column",
      padding: "16px",
      gap: "8px",
      display: "none",
    },
  },
  navLinksOpen: {
    "@media (max-width: 768px)": {
      display: "flex",
    },
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "500",
    fontSize: "14px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    border: "2px solid transparent",
  },
  navLinkActive: {
    background: "rgba(255, 255, 255, 0.2)",
    borderBottom: "2px solid white",
  },
  logoutBtn: {
    background: "rgba(255, 255, 255, 0.2)",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontWeight: "500",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

// Apply media queries via inline styles (for hamburger menu)
if (typeof window !== "undefined" && window.innerWidth <= 768) {
  styles.hamburger.display = "flex";
  styles.navLinks.position = "absolute";
  styles.navLinks.top = "100%";
  styles.navLinks.left = 0;
  styles.navLinks.right = 0;
}

export default Navbar;
