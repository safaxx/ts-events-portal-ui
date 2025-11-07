import React from 'react';
import './EventCard.css';

function EventCard({ event }) {
  // Format the date and time nicely
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const { date, time } = formatDateTime(event.eventDateTime);

  // Parse tags if they exist
  const tags = event.tags ? event.tags.split(',').map(tag => tag.trim()) : [];

  return (
    <div className="event-card">
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
          <span className="detail-text">{date}</span>
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
        <div className="detail-item">
          <span className="detail-icon">🌍</span>
          <span className="detail-text">{event.timezone}</span>
        </div>
      </div>

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
        <button className="rsvp-button">RSVP</button>
      </div>
    </div>
  );
}

export default EventCard;