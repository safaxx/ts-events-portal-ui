import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { convertToUserTimezone, getEventEnd } from "../../utils/TimeZoneUtils";
import EventCard from "../Events/EventCard/EventCard";

import LoadingComponent from "../Loading/LoadingComponent";
import eventService from "../Services/EventService";
import "./Dashboard.css";

function Dashboard() {
  const [allEvents, setAllEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming"); // "upcoming" | "past"
  const [searchQuery, setSearchQuery] = useState("");

   // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);


  useEffect(() => {
    fetchEvents();
  }, [currentPage, pageSize]); // Refetch when page or size changes

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await eventService.getAllEvents(currentPage, pageSize);

      if (response.success && response.events) {
        setAllEvents(response.events);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
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
      event.shortDescription.toLowerCase().includes(q) ||
      (event.tags && event.tags.toLowerCase().includes(q))
    );
  };

  const filteredEvents = allEvents
    .filter((event) => {
      const eventStart = convertToUserTimezone(event.eventDateTime);
      const eventEnd = getEventEnd(event);

      if (!eventEnd) return true; // edge case

      return activeTab === "upcoming"
        ? eventEnd >= now // still upcoming if end time is in future
        : eventEnd < now; // past only if end time is in past
    })
    .filter(matchesSearch)
    .sort((a, b) => {
      const dateA = convertToUserTimezone(a.eventDateTime);
      const dateB = convertToUserTimezone(b.eventDateTime);
      return activeTab === "upcoming"
        ? dateA - dateB // soonest first
        : dateB - dateA; // recent past first
    });
  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0); // Reset to first page when changing page size
  };

  // LOADING UI
  if (isLoading) {
    return (
      <div className="dashboard-container">
        <LoadingComponent />
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
            Upcoming
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`dashboard-toggle-btn ${
              activeTab === "past" ? "active" : ""
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="empty-filtered-state">
          <p className="empty-message">
            {activeTab === "past"
              ? "📭 No past events to show"
              : "🎉 No upcoming events at the moment"}
          </p>
        </div>
      ) : (
        <>
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <EventCard key={event.eventId} event={event} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pagination-container">
            <div className="pagination-info">
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
              <div className="page-size-selector">
                <label htmlFor="pageSize">Items per page:</label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  className="page-size-select"
                >
                  <option value="6">6</option>
                  <option value="12">12</option>
                  <option value="18">18</option>
                 
                </select>
              </div>
            </div>

            <div className="pagination-controls">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className="pagination-button"
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              
              <div className="page-numbers">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`page-number ${
                      currentPage === index ? "active" : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className="pagination-button"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
