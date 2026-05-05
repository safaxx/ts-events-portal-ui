import { useEffect, useRef, useState } from "react";
import eventService from "../../components/Services/EventService";
import LoadingComponent from "../Loading/LoadingComponent";
import EventCard from "./EventCard/EventCard";
import "./MyEventsPage.css";

// Swiper imports
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function MyEventsPage() {
  const [activeTab, setActiveTab] = useState("created"); // "rsvps" | "created"
  const [loading, setLoading] = useState(true);
  const [myCreatedEvents, setMyCreatedEvents] = useState([]);
  const [myRsvps, setMyRsvps] = useState([]);

  // Track which tabs have already been fetched to avoid redundant calls
  const hasFetchedCreated = useRef(false);
  const hasFetchedRsvps = useRef(false);

  // Lazy fetch: only load data for the active tab (and only once per tab)
  useEffect(() => {
    if (activeTab === "created" && !hasFetchedCreated.current) {
      fetchCreatedEvents();
    } else if (activeTab === "rsvps" && !hasFetchedRsvps.current) {
      fetchRsvps();
    }
  }, [activeTab]);

  const fetchCreatedEvents = async () => {
    try {
      setLoading(true);
      const created = await eventService.getMyCreatedEvents();
      console.log("Created events:", created);

      if (created?.events) {
        setMyCreatedEvents(created.events);
      }
      hasFetchedCreated.current = true;
    } catch (err) {
      console.error("Error loading created events:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRsvps = async () => {
    try {
      setLoading(true);
      const rsvps = await eventService.getMyRSVPs();
      console.log("My RSVPs:", rsvps);

      setMyRsvps(rsvps?.events || []);
      hasFetchedRsvps.current = true;
    } catch (err) {
      console.error("Error loading RSVPs:", err);
    } finally {
      setLoading(false);
    }
  };



  // LOADING UI
  if (loading) {
    return (
      <div className="dashboard-container">
        <LoadingComponent />
      </div>
    );
  }

  const activeList = activeTab === "created" ? myCreatedEvents : myRsvps;

  return (
    <div className="my-events-page">
      <h2 className="section-title">
        {activeTab === "created" ? "My Created Events" : "My RSVPs"}
      </h2>

      {/* --- Toggle Buttons (same style as Dashboard) --- */}
      <div className="filter-controls">
        <button
          className={`filter-button ${activeTab === "created" ? "active" : ""}`}
          onClick={() => setActiveTab("created")}
        >
          🎨 Created Events ({myCreatedEvents.length})
        </button>

        <button
          className={`filter-button ${activeTab === "rsvps" ? "active" : ""}`}
          onClick={() => setActiveTab("rsvps")}
        >
          📨 My RSVPs ({myRsvps.length})
        </button>
      </div>

      {/* EVENTS SWIPER (matches Dashboard layout) */}
      {activeList.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          observer={true}
          observeParents={true}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="events-swiper"
        >
          {activeList.map((event) => (
            <SwiperSlide key={event.eventId}>
              <EventCard event={event} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="empty-filtered-state">
          <p className="empty-text">
            {activeTab === "created"
              ? "You haven't created any events yet."
              : "You haven't RSVP'd to any events yet."}
          </p>
        </div>
      )}
    </div>
  );
}
