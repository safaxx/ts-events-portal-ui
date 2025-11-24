import React, { useState } from "react";
import authService from "../../Services/AuthService";
import { useNavigate } from "react-router-dom";
import "./EventCard.css";
import {
  formatEventDateTime,
  getRelativeDate,
  getTimeUntilEvent,
  getTimezoneAbbreviation,
  getUserTimezone,
} from "../../../utils/TimeZoneUtils";
import eventService from "../../Services/EventService";

function EventCard({ event }) {
  // Format the date and time in user's timezone
  const { date, time, dateObject } = formatEventDateTime(event.eventDateTime);
  const relativeDate = getRelativeDate(event.eventDateTime);
  const timeUntil = getTimeUntilEvent(event.eventDateTime);
  const userTimezone = getTimezoneAbbreviation(getUserTimezone());
  const tags = event.tags ? event.tags.split(",").map((tag) => tag.trim()) : [];
  const isPastEvent = dateObject && dateObject < new Date(); // Check if event is in the past
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [hasRSVPed, setHasRSVPed] = useState(event.currentUserRSVP || false);

  const handleCardClick = () => {
    navigate(`/events/${event.eventId}`);
  };

  // const handleRSVP = async () => {
  //   // Check if user is logged in
  //   if (!authService.isAuthenticated()) {
  //     // Redirect to login page
  //     navigate("/login");
  //     return;
  //   }
  //   setLoading(true);
  //   setMessage({ text: "", type: "" });

  //   try {
  //     const response = await eventService.rsvpToEvent(event.eventId, true);
  //     if (response.success) {
  //       setMessage({ text: "RSVP successful!", type: "success" });
  //       setHasRSVPed(true);
  //       setTimeout(() => {
  //         setMessage({ text: "", type: "" });
  //       }, 3000);
  //     } else {
  //       setMessage({
  //         text: response.message || "Failed to RSVP",
  //         type: "error",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error submitting RSVP:", error);

  //     // Check if it's a duplicate RSVP error
  //     if (
  //       error.message.includes("already RSVPed") ||
  //       error.message.includes("already RSVP")
  //     ) {
  //       setHasRSVPed(true);
  //       setMessage({
  //         text: "You've already RSVP'd to this event!",
  //         type: "success",
  //       });
  //       setTimeout(() => {
  //         setMessage({ text: "", type: "" });
  //       }, 3000);
  //     }

  //     // Check if it's an authentication error
  //     if (
  //       error.message.includes("unauthorized") ||
  //       error.message.includes("Session expired")
  //     ) {
  //       navigate("/login");
  //     } else {
  //       setMessage({
  //         text: error.message || "Failed to RSVP. Please try again.",
  //         type: "error",
  //       });
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div
      className={`event-card ${isPastEvent ? "past-event" : ""}`}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      {/* Event Type Badge */}
      <div className="event-type-badge">
        {event.eventType === "online" ? "🌐 Online" : "📍 In-Person"}
      </div>

      {/* Event Title */}
      <h3 className="event-title">{event.title}</h3>

      {/* Event Description */}
      <p className="event-description">{event.description}</p>

      {/* Event Details */}
      <div className="event-details">
        <div className="detail-item">
          <span className="detail-icon">📅</span>
          <span className="detail-text">{relativeDate}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">⏰</span>
          <span className="detail-text">{time}</span>
        </div>
        {event.duration && (
          <div className="detail-item">
            <span className="detail-icon">⏱️</span>
            <span className="detail-text">{event.duration} mins</span>
          </div>
        )}
      </div>

      {/* Timezone Info 
      <div className="timezone-info">
        <span className="timezone-icon">🌍</span>
        <span className="timezone-text">
          {userTimezone} (Your timezone)
        </span>
      </div> */}

      {/* Time Until Event */}
      {!isPastEvent && (
        <div className="time-until">
          <span className="time-until-icon">⏳</span>
          <span className="time-until-text">{timeUntil}</span>
        </div>
      )}

      {/* Organizer Info */}
      <div className="organizer-info">
        <span className="organizer-label">Organized by:</span>
        <span className="organizer-email">{event.organizerEmail}</span>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="event-tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      {/* RSVP Message */}
      {message.text && (
        <div className={`rsvp-message ${message.type}`}>{message.text}</div>
      )}
      {/* RSVP Count & Button */}
      <div className="event-footer">
        <div className="rsvp-count">
          <span className="rsvp-icon">👥</span>
          <span>{event.allRSVPs || 0} attending</span>
        </div>
        <button className="share-button" >
          🔗 Share
        </button>
      </div>
    </div>
  );
}

export default EventCard;
