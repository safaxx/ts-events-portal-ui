import React, { useEffect, useState } from "react";
import eventService from "../../components/Services/EventService";
import "./MyEventsPage.css";
import EventCard from "./EventCard/EventCard";

export default function MyEventsPage() {
  const [activeTab, setActiveTab] = useState("rsvps"); // "rsvps" | "created"
  const [loading, setLoading] = useState(true);
  const [myCreatedEvents, setMyCreatedEvents] = useState([]);
  const [myRsvps, setMyRsvps] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const created = await eventService.getMyCreatedEvents();
        const rsvps = await eventService.getMyRSVPs();

        console.log("Created events:", created);
        console.log("My RSVPs:", rsvps);

        setMyCreatedEvents(created?.events || []);
        setMyRsvps(rsvps?.events || []);
      } catch (err) {
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <div className="loading">Loading events...</div>;

  const activeList = activeTab === "created" ? myCreatedEvents : myRsvps;

  return (
    <div className="my-events-page">
      <h2 className="section-title">
        {activeTab === "created" ? "My Created Events" : "My RSVPs"}
      </h2>

      {/* --- Toggle Buttons (same style as Dashboard) --- */}
      <div className="filter-controls">
        <button
          className={`filter-button ${
            activeTab === "created" ? "active" : ""
          }`}
          onClick={() => setActiveTab("created")}
        >
          🎨 Created Events ({myCreatedEvents.length})
        </button>

        <button
          className={`filter-button ${
            activeTab === "rsvps" ? "active" : ""
          }`}
          onClick={() => setActiveTab("rsvps")}
        >
          📨 My RSVPs ({myRsvps.length})
        </button>
      </div>

      {/* EVENTS GRID */}
      <div className="events-grid">
        {activeList.length > 0 ? (
          activeList.map((event) => (
            <EventCard key={event.eventId} event={event} />
          ))
        ) : (
          <p className="empty-text">
            {activeTab === "created"
              ? "You haven’t created any events yet."
              : "You haven’t RSVP’d to any events yet."}
          </p>
        )}
      </div>
    </div>
  );
}
