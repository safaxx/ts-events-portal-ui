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
  // Event is past only if NOW is after (start + duration)
 const checkPastEvent = () => {
  if (!dateObject || !event.duration) return false;

  const eventEnd = new Date(dateObject.getTime() + event.duration * 60000); 
  return new Date() > eventEnd;
};
  const navigate = useNavigate();

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
          text: "Join this event!",
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
  // Check if event is currently live
  const isLiveEvent = () => {
    if (!event.eventDateTime || !event.duration) return false;

    const start = new Date(event.eventDateTime);
    const end = new Date(start.getTime() + event.duration * 60000);
    const now = new Date();

    return now >= start && now <= end;
  };

  return (
    <div className={`event-card ${checkPastEvent() ? "past-event" : ""}`}>
      {/* Event Title & Event link*/}
      <div className="event-header">
        <h3 className="event-title">{event.title}</h3>

        {/* Show Join Now only if online + currently live */}
        {event.eventType === "online" && isLiveEvent() ? (
          <a
            href={event.eventLink}
            target="_blank"
            rel="noopener noreferrer"
            className="join-now"
            onClick={(e) => e.stopPropagation()}
          >
            Join Now
          </a>
        ) : (
          // Otherwise show the countdown (future events)
          !checkPastEvent() && (
            <div className="time-until">
              <span className="time-until-icon">⏳</span>
              <span className="time-until-text">{timeUntil}</span>
            </div>
          )
        )}
      </div>

      {/* Event Description */}
      <p className="event-description">{event.shortDescription}</p>

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

        <div className="detail-item">
          <span className="detail-icon">👥</span>
          <span className="detail-text">{event.allRSVPs || 0}</span>
        </div>
      </div>

      {/* Timezone Info 
      <div className="timezone-info">
        <span className="timezone-icon">🌍</span>
        <span className="timezone-text">
          {userTimezone} (Your timezone)
        </span>
      </div> */}

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

      <div className="event-footer">
        <button className="share-button" onClick={handleShare}>
          Share
        </button>
        <button className="event-details-button" onClick={handleViewDetails}>
          View Details
        </button>
      </div>
    </div>
  );
}

export default EventCard;
