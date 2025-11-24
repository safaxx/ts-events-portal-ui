import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../components/Services/AuthService";
import "./NavBar.css";

function NavBar() {
  const nav = useNavigate();
  const isAuthed = authService.isAuthenticated();

  const handleLogout = () => {
    authService.logout(); // clears localStorage + redirects to /login
    // optional: hard reload to reset axios interceptors
    window.location.href = "/dashboard";
  };

  return (
    <header className="topbar">
      <img src="/logo-ts.svg" alt="Tech Sisters logo" className="topbar__logo" />
      <div className="topbar__brand" onClick={() => nav("/dashboard")}>
        Tech Sisters Events
      </div>

      <nav className="topbar__nav">
        <>
          <button className="topbar__link" onClick={() => nav("/create-event")}>
            Create Event
          </button>
        </>

        {isAuthed ? (
          <>
            <button
              className="topbar__link topbar__logout"
              onClick={handleLogout}
            >
              Log out
            </button>
          </>
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
