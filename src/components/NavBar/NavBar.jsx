import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../components/Services/AuthService";
import "./NavBar.css";

function NavBar() {
  const nav = useNavigate();
  const isAuthed = authService.isAuthenticated();

  const [menuOpen, setMenuOpen] = useState(false);

  const userName = localStorage.getItem("name");
  const userEmail = localStorage.getItem("email");

  const userRoles =localStorage.getItem("roles") || "";

  // Check if user has admin role
  const isAdmin = userRoles.includes("ROLE_ADMIN");

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/dashboard";
  };

  return (
    <header className="topbar">
      <div className="topbar__brand" onClick={() => nav("/dashboard")}>
        <img
          src="/logo-ts.svg"
          alt="Tech Sisters logo"
          className="topbar__logo"
        />
      </div>

      <nav className="topbar__nav">

        {isAdmin && (
          <button className="topbar__link" onClick={() => nav("/create-event")}>
            Create Event
          </button>
        )}

        {isAuthed && (
          <button className="topbar__link" onClick={() => nav("/my-events")}>
            My Events
          </button>
        )}

        {/* USER AVATAR DROPDOWN */}
        {isAuthed ? (
          <div className="user-menu-wrapper">
            <div
              className="user-avatar"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {userName?.charAt(0).toUpperCase() || "U"}
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
          <button className="topbar__link" onClick={() => nav("/login")}>
            Log in
          </button>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
