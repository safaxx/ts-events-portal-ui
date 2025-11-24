import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import eventService from "../../components/Services/EventService";
import authService from "../../components/Services/AuthService";
import {
  formatEventDateTime,
  getRelativeDate,
  getTimeUntilEvent,
} from "../../utils/TimeZoneUtils";

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [hasRSVPed, setHasRSVPed] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await eventService.getEventById(eventId);
        setEvent(res.dto);

        const loggedInUser = authService.getUserEmail();
        console.log("loggedInUser: ", loggedInUser);
        console.log("createdBy: ", res.dto.createdBy);
        if (loggedInUser && res.dto.createdBy === loggedInUser) {
          setIsCreator(true);
        }

        setHasRSVPed(res.dto.currentUserRSVP || false);
      } catch (err) {
        console.error("Failed to load event", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [eventId]);

  const handleRSVP = async () => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    try {
      setRsvpLoading(true);
      const res = await eventService.rsvpToEvent(event.eventId, true);

      if (res.success) {
        setHasRSVPed(true);
        setMessage("RSVP successful!");
      } else {
        setMessage(res.message || "Failed to RSVP");
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    } finally {
      setRsvpLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  const { date, time } = formatEventDateTime(event.eventDateTime);
  const relativeDate = getRelativeDate(event.eventDateTime);
  const timeUntil = getTimeUntilEvent(event.eventDateTime);
  const isPastEvent = new Date(event.eventDateTime) < new Date();

  return (
    <div className="event-details-container">
      {/* <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button> */}

      <div className="event-details-header">
        <h1 className="event-details-title">{event.title}</h1>

        <span className="event-type-badge">
          {event.eventType === "online" ? "🌐 Online" : "📍 In-Person"}
        </span>
      </div>
      <div className="event-details-section">
        <span className="event-details-label">Description</span>
        <p className="event-details-text">{event.description}</p>
      </div>

      <div className="event-details-grid">
        <div>
          <span className="event-details-label">Date</span>
          <p className="event-details-text">
            {relativeDate} — {date}
          </p>
        </div>

        <div>
          <span className="event-details-label">Time</span>
          <p className="event-details-text">{time}</p>
        </div>
      </div>

      {!isPastEvent && (
        <div className="time-until">
          <span className="time-until-icon">⏳</span>
          <span className="time-until-text">{timeUntil}</span>
        </div>
      )}

      <div className="event-details-section">
        <span className="event-details-label">Organizer</span>
        <div className="organizer-box">{event.organizerEmail}</div>
      </div>

      {/* ACTION BUTTONS ROW */}
      <div className="event-actions-row">
        {/* Edit button - only for creator */}
        {isCreator && (
          <button
            className="edit-button"
            onClick={() => navigate(`/events/${eventId}/edit`)}
          >
            ✏ Edit Event
          </button>
        )}

        {/* RSVP button (or confirmed badge) - only if not past */}
        {!isPastEvent && !hasRSVPed && (
          <button
            className="rsvp-button"
            onClick={handleRSVP}
            disabled={rsvpLoading}
          >
            {rsvpLoading ? "RSVPing..." : "RSVP"}
          </button>
        )}

        {hasRSVPed && <div className="rsvp-confirmed">✓ You're going!</div>}
      </div>

      {message && <div className="rsvp-message">{message}</div>}
    </div>
  );
}
