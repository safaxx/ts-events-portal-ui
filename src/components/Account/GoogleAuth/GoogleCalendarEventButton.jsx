import authService from "../../Services/AuthService";

import "./GoogleCalendarEventButton.css";

// Define the API endpoint URL for your Spring Boot application
// Replace with your actual domain/port if different from the example
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const CONNECT_ENDPOINT = "/public/events/add-google-calendar-event";
const RETURN_URL = window.location;

const GoogleCalendarEventButton = ({ eventId }) => {
  const userEmail = authService.getUserEmail();

  // The full URL the user will be redirected to
  const fullConnectUrl = `${API_BASE_URL}${CONNECT_ENDPOINT}?email=${userEmail}&eventId=${eventId}&returnUrl=${RETURN_URL}`;

  return (
    <div style={{ textAlign: "center" }}>
      <a href={fullConnectUrl} target="#" className="button-link">
        <img
          src="/google-cal-logo.png"
          alt="Google Calendar logo"
          className="topbar__logo"
        />{" "}
        <div className="btn-calendar-text">
            Google Calendar
        </div>
       
      </a>
    </div>
  );
};

// Simple inline styling for the button
const buttonStyle = {
  display: "inline-block",
  padding: "10px 20px",
  backgroundColor: "#992ff5ff", // Google Blue
  color: "white",
  textDecoration: "none",
  borderRadius: "4px",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
};

export default GoogleCalendarEventButton;
