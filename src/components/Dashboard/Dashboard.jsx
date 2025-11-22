import React, { useState, useEffect } from "react";
import EventCard from "../Events/EventCard/EventCard";
import "./Dashboard.css";
import eventService from "../Services/EventService";
import {convertToUserTimezone} from "../../utils/TimeZoneUtils"

function Dashboard() {
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPastEvents, setShowPastEvents] = useState(false);

  // Fetch events when component loads
  useEffect(() => {
    fetchEvents();
  }, []); // Empty array means this runs once when component mounts

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await eventService.getAllEvents();

      if (response.success && response.events) {
        setAllEvents(response.events);
      } else {
        setError(response.message || "No events found");
      }
    } catch (err) {
      setError("Failed to load events. Please try again later.");
      console.error("Error fetching events:", err);
    } finally {
      setIsLoading(false);
    }
  };
  // Filter events based on showPastEvents toggle
  const getFilteredEvents = () => {
    const now = new Date();

    if (showPastEvents) {
      // Show only past events, sorted by most recent first
      return allEvents
        .filter((event) => {
          const eventDate = convertToUserTimezone(event.eventDateTime);
          return eventDate < now;
        })
        .sort((a, b) => {
          const dateA = convertToUserTimezone(a.eventDateTime);
          const dateB = convertToUserTimezone(b.eventDateTime);
          return dateB - dateA; // Most recent past events first
        });
    } else {
      // Show only upcoming/current events, sorted by soonest first
      return allEvents
        .filter((event) => {
          const eventDate = convertToUserTimezone(event.eventDateTime);
          return eventDate >= now;
        })
        .sort((a, b) => {
          const dateA = convertToUserTimezone(a.eventDateTime);
          const dateB = convertToUserTimezone(b.eventDateTime);
          return dateA - dateB; // Soonest events first
        });
    }
  };

  const filteredEvents = getFilteredEvents();
  const upcomingCount = allEvents.filter((event) => {
    const eventDate = convertToUserTimezone(event.eventDateTime);
    return eventDate >= new Date();
  }).length;
  const pastCount = allEvents.length - upcomingCount;

  // Show loading state
  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-state">
          <p className="error-message">⚠️ {error}</p>
          <button onClick={fetchEvents} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (allEvents.length === 0) {
    return (
      <div className="dashboard-container">
        <div className="empty-state">
          <h2>No Events Yet 🌸</h2>
          <p>Be the first to create an event!</p>
        </div>
      </div>
    );
  }

  // Show events
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>{showPastEvents ? "Past Events" : "Upcoming Events"}</h2>
        <div className="header-stats">
          <p className="event-count">
            {filteredEvents.length} event
            {filteredEvents.length !== 1 ? "s" : ""}
            {showPastEvents ? " in the past" : " coming up"}
          </p>
        </div>
      </div>

      {/* Toggle Switch */}
      <div className="filter-controls">
        <button
          className={`filter-button ${!showPastEvents ? "active" : ""}`}
          onClick={() => setShowPastEvents(false)}
        >
          <span className="filter-icon">📅</span>
          Upcoming ({upcomingCount})
        </button>
        <button
          className={`filter-button ${showPastEvents ? "active" : ""}`}
          onClick={() => setShowPastEvents(true)}
        >
          <span className="filter-icon">🕐</span>
          Past Events ({pastCount})
        </button>
      </div>

      {/* Empty state for filtered results */}
      {filteredEvents.length === 0 ? (
        <div className="empty-filtered-state">
          <p className="empty-message">
            {showPastEvents
              ? "📭 No past events to show"
              : "🎉 No upcoming events at the moment"}
          </p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard key={event.eventId} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
