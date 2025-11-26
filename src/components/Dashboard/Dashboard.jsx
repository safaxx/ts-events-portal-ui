import React, { useState, useEffect } from "react";
import EventCard from "../Events/EventCard/EventCard";
import "./Dashboard.css";
import eventService from "../Services/EventService";
import { convertToUserTimezone } from "../../utils/TimeZoneUtils";
import { Search } from "lucide-react";

function Dashboard() {
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" | "past"
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

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
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const now = new Date();

  // 🔍 Search filter
  const matchesSearch = (event) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(q) ||
      event.description.toLowerCase().includes(q) ||
      (event.tags && event.tags.toLowerCase().includes(q))
    );
  };

  const filteredEvents = allEvents
    .filter((event) => {
      const eventDate = convertToUserTimezone(event.eventDateTime);
      return activeTab === "upcoming" ? eventDate >= now : eventDate < now;
    })
    .filter(matchesSearch)
    .sort((a, b) => {
      const dateA = convertToUserTimezone(a.eventDateTime);
      const dateB = convertToUserTimezone(b.eventDateTime);
      return activeTab === "upcoming"
        ? dateA - dateB // soonest first
        : dateB - dateA; // recent past first
    });

  const upcomingCount = allEvents.filter((event) => {
    const eventDate = convertToUserTimezone(event.eventDateTime);
    return eventDate >= new Date();
  }).length;

  const pastCount = allEvents.length - upcomingCount;

  // LOADING UI
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

  // ERROR UI
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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>{activeTab === "upcoming" ? "Upcoming Events" : "Past Events"}</h2>
        <p className="event-count">{filteredEvents.length} event(s)</p>
      </div>

      {/* 🔍 Search + Toggle */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "stretch",
          marginBottom: "48px",
        }}
      >
        {/* Search Bar */}
        <div className="dashboard-search-wrapper">
          <Search
            size={20}
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#999",
            }}
          />

          <input
            type="text"
            placeholder="Search events, keywords, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dashboard-search-input"
          />
        </div>

        {/* Toggle */}
        <div className="dashboard-toggle-container">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`dashboard-toggle-btn ${
              activeTab === "upcoming" ? "active" : ""
            }`}
          >
            Upcoming ({upcomingCount})
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`dashboard-toggle-btn ${
              activeTab === "past" ? "active" : ""
            }`}
          >
            Past ({pastCount})
          </button>
        </div>
      </div>

      {/* No results */}
      {filteredEvents.length === 0 ? (
        <div className="empty-filtered-state">
          <p className="empty-message">
            {activeTab === "past"
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
