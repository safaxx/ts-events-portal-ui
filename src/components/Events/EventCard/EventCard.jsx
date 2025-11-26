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

  const handleViewDetails = (e) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/events/${event.eventId}`);
  };

  const handleShare = async (e) => {
  e.stopPropagation(); // prevents card click
  
  const shareUrl = `${window.location.origin}/events/${event.eventId}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: event.title,
        text: "Join this event on Gatherly!",
        url: shareUrl,
      });
    } catch (error) {
      console.log("Share canceled or failed:", error);
    }
  } else {
    // Fallback for desktop
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  }
};


  return (
    <div className={`event-card ${isPastEvent ? "past-event" : ""}`}>
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
        {/* Event Type Badge */}
        <div className="detail-item">
          <span className="detail-icon">🌐</span>
          <span className="detail-text">
            {event.eventType === "online" ? " Online" : "📍 In-Person"}
          </span>
        </div>
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
        <span className="organizer-label">Hosted by:(replace with name)</span>
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
          <span>{event.allRSVPs || 0}</span>
        </div>
        <button className="share-button"  onClick={handleShare}>Share</button>
        <button className="event-details-button" onClick={handleViewDetails}>
          View Details
        </button>
      </div>
    </div>
  );
}

export default EventCard;
