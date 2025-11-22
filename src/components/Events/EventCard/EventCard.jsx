import React from 'react';
import './EventCard.css';
import { 
  formatEventDateTime, 
  getRelativeDate,
  getTimeUntilEvent,
  getTimezoneAbbreviation,
  getUserTimezone 
} from '../../../utils/TimeZoneUtils';

function EventCard({ event }) {
  // Format the date and time in user's timezone
  const { date, time, dateObject } = formatEventDateTime(event.eventDateTime);
  const relativeDate = getRelativeDate(event.eventDateTime);
  const timeUntil = getTimeUntilEvent(event.eventDateTime);
  const userTimezone = getTimezoneAbbreviation(getUserTimezone());

  // Parse tags if they exist
  const tags = event.tags ? event.tags.split(',').map(tag => tag.trim()) : [];

  // Check if event is in the past
  const isPastEvent = dateObject && dateObject < new Date();

  return (
    <div className={`event-card ${isPastEvent ? 'past-event' : ''}`}>
      {/* Event Type Badge */}
      <div className="event-type-badge">
        {event.eventType === 'online' ? '🌐 Online' : '📍 In-Person'}
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
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}

      {/* RSVP Count & Button */}
      <div className="event-footer">
        <div className="rsvp-count">
          <span className="rsvp-icon">👥</span>
          <span>{event.allRSVPs || 0} attending</span>
        </div>
        {!isPastEvent && (
          <button className="rsvp-button">RSVP</button>
        )}
      </div>
    </div>
  );
}

export default EventCard;