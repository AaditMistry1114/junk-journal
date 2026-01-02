import { Link, useLocation } from "react-router-dom";
import "./Header.css";

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="app-title">
          Junk <span>Journal</span>
        </h1>

        <nav className="nav-links">
          <Link
            to="/"
            className={location.pathname === "/" ? "active" : ""}
          >
            Journal
          </Link>
          <span className="divider">|</span>
          <Link
            to="/stats"
            className={location.pathname === "/stats" ? "active" : ""}
          >
            Stats
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
