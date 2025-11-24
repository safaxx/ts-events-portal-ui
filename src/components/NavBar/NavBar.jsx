import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../components/Services/AuthService";
import "./NavBar.css";

function NavBar() {
  const nav = useNavigate();
  const isAuthed = authService.isAuthenticated();

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
        {/* Always visible */}
        <button className="topbar__link" onClick={() => nav("/create-event")}>
          Create Event
        </button>

        {/* Visible only when logged in */}
        {isAuthed && (
          <button className="topbar__link" onClick={() => nav("/my-events")}>
            My Events
          </button>
        )}

        {/* Login / Logout */}
        {isAuthed ? (
          <button
            className="topbar__link topbar__logout"
            onClick={handleLogout}
          >
            Log out
          </button>
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
