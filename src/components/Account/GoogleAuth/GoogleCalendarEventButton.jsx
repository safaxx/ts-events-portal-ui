import authService from "../../Services/AuthService";

import "./GoogleCalendarEventButton.css";

// Define the API endpoint URL for your Spring Boot application
// Replace with your actual domain/port if different from the example
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const CONNECT_ENDPOINT = "/public/events/add-google-calendar-event";
const RETURN_URL = window.location;

const GoogleCalendarEventButton = ({ eventLink }) => {
  const userEmail = authService.getUserEmail();

  // The full URL the user will be redirected to
  const fullConnectUrl = `${eventLink}`;

  return (
    <div style={{ textAlign: "center" }}>
      <a href={fullConnectUrl} className="calendar-btn">
        <img
          src="/google-cal-logo.png"
          alt="Google Calendar"
          className="calendar-logo"
        />
        <span>Add to Calendar</span>
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
