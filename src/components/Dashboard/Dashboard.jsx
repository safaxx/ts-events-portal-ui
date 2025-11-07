import React, { useState, useEffect } from 'react';
import EventCard from '../Events/EventCard/EventCard';
import './Dashboard.css';
import eventService from '../Services/EventService'

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setEvents(response.events);
      } else {
        setError(response.message || 'No events found');
      }
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
  if (events.length === 0) {
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
        <h2>Upcoming Events</h2>
        <p className="event-count">{events.length} event{events.length !== 1 ? 's' : ''} found</p>
      </div>
      
      <div className="events-grid">
        {events.map((event) => (
          <EventCard key={event.eventId} event={event} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;