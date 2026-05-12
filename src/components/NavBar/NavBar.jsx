import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authService from "../../components/Services/AuthService";
import "./NavBar.css";

function NavBar() {
  const nav = useNavigate();
  const location = useLocation();
  const isAuthed = authService.isAuthenticated();

  const [menuOpen, setMenuOpen] = useState(false);

  const userName = localStorage.getItem("name");
  const userEmail = localStorage.getItem("email");

  const userRoles = localStorage.getItem("roles") || "";
  const isAdmin = userRoles.includes("ROLE_ADMIN");

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/dashboard";
  };

  return (
    <aside className="sidebar">
      {/* Logo / Brand — always visible */}
      <div className="sidebar__brand" onClick={() => nav("/dashboard")}>
        <img src="/logo-ts.svg" alt="Tech Sisters logo" className="sidebar__logo" />
      </div>

      <nav className="sidebar__nav">
        {location.pathname !== "/dashboard" && (
          <button
            className="sidebar__item"
            onClick={() => nav(-1)}
          >
            <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            <span className="sidebar__label">Back</span>
          </button>
        )}

        {isAdmin && (
          <button
            className="sidebar__item"
            onClick={() => nav("/create-event")}
          >
            {/* Icon */}
            <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="12" y1="14" x2="12" y2="18" />
              <line x1="10" y1="16" x2="14" y2="16" />
            </svg>
            <span className="sidebar__label">Create Event</span>
          </button>
        )}

        {isAuthed && (
          <button
            className="sidebar__item"
            onClick={() => nav("/my-events")}
          >
            <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
            <span className="sidebar__label">My Events</span>
          </button>
        )}
      </nav>

      {/* Bottom: avatar or login */}
      <div className="sidebar__footer">
        {isAuthed ? (
          <div className="user-menu-wrapper">
            <div
              className="user-avatar"
              onClick={() => setMenuOpen(!menuOpen)}
              title={userName || "User"}
            >
              {userName?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="sidebar__user-info">
              <span className="sidebar__username">{userName}</span>
              <span className="sidebar__email">{userEmail}</span>
            </div>

            {menuOpen && (
              <div className="user-dropdown">
                <p className="dropdown-name">{userName}</p>
                <p className="dropdown-email">{userEmail}</p>
                <button className="dropdown-logout" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="sidebar__item" onClick={() => nav("/login")}>
            <svg className="sidebar__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span className="sidebar__label">Log in</span>
          </button>
        )}
      </div>
    </aside>
  );
}

export default NavBar;
