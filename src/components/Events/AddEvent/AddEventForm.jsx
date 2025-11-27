import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./AddEventForm.css";
import eventService from "../../Services/EventService";
import {
  getUserTimezone,
  getTimezoneAbbreviation,
} from "../../../utils/TimeZoneUtils";

function AddEventForm() {
  const navigate = useNavigate();
  const { eventId } = useParams(); // Get eventId from URL if editing
  const location = useLocation();
  const [userTimezone, setUserTimezone] = useState(getUserTimezone());
  const [timezoneAbbr, setTimezoneAbbr] = useState("");
  const loggedInEmail = localStorage.getItem("email");
  // Determine if we're editing based on URL params or location state
  const isEditMode = Boolean(eventId) || location.state?.event;
  const eventToEdit = location.state?.event;

  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    long_description: "",
    organizer_email: "",
    event_datetime: "",
    timezone: "",
    event_type: "online",
    event_link: "",
    event_location: "",
    tags: "",
    duration: "",
  });

  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Set user's timezone on component mount
  useEffect(() => {
    const tz = getUserTimezone();
    const abbr = getTimezoneAbbreviation(tz);
    setUserTimezone(tz);
    setTimezoneAbbr(abbr);

    // Pre-fill timezone in form
    setFormData((prev) => ({
      ...prev,
      timezone: tz,
    }));
  }, []);

  // Load event data if editing
  useEffect(() => {
    const loadEventData = async () => {
      if (isEditMode) {
        try {
          let eventData = eventToEdit;

          // If we don't have event data in state, fetch it
          if (!eventData && eventId) {
            setLoading(true);
            const response = await eventService.getEventById(eventId);
            if (response.success) {
              eventData = response.dto;
            } else {
              setMessage({ text: "Failed to load event data", type: "error" });
              return;
            }
          }

          if (eventData) {
            // Convert OffsetDateTime to datetime-local format
            const eventDate = new Date(eventData.eventDateTime);
            const localDateTime = new Date(
              eventDate.getTime() - eventDate.getTimezoneOffset() * 60000
            )
              .toISOString()
              .slice(0, 16);

            setFormData({
              title: eventData.title || "",
              short_description: eventData.shortDescription || "",
              long_description: eventData.longDescription || "",
              organizer_email: loggedInEmail || "",
              event_datetime: localDateTime,
              timezone: eventData.timezone || userTimezone,
              event_type: eventData.eventType || "online",
              event_link: eventData.eventLink || "",
              event_location: eventData.eventLocation || "",
              tags: eventData.tags || "",
              duration: eventData.duration || "",
            });
          }
        } catch (error) {
          console.error("Error loading event:", error);
          setMessage({ text: "Failed to load event data", type: "error" });
        } finally {
          setLoading(false);
        }
      }
    };

    loadEventData();
  }, [isEditMode, eventId, eventToEdit, userTimezone]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const convertToISO8601 = (datetimeLocal) => {
    if (!datetimeLocal) return "";
    const date = new Date(datetimeLocal);
    const isoString = date.toISOString();
    return isoString;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Check if user is logged in
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setMessage({
        text:
          "You must be logged in to " +
          (isEditMode ? "edit" : "create") +
          " an event. Redirecting to login...",
        type: "error",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      setLoading(false);
      return;
    }

    try {
      const formattedData = {
        ...formData,
        event_datetime: convertToISO8601(formData.event_datetime),
        timezone: userTimezone,
      };

      if (formattedData.event_type === "online") {
        formattedData.event_location = null;
      } else if (formattedData.event_type === "in-person") {
        formattedData.event_link = null;
      }

      let response;
      if (isEditMode) {
        // Update existing event
        response = await eventService.updateEvent(
          eventId || eventToEdit.eventId,
          formattedData
        );
      } else {
        // Create new event
        response = await eventService.createEvent(formattedData);
      }

      if (response.success) {
        setMessage({
          text: isEditMode
            ? "Event updated successfully! 🎉"
            : "Event created successfully! 🎉",
          type: "success",
        });

        setTimeout(() => {
          if (isEditMode) {
            // Navigate back to event details page
            navigate(`/events/${eventId || eventToEdit.eventId}`);
          } else {
            // Navigate to dashboard
            navigate("/dashboard");
          }
        }, 1500);
      } else {
        setMessage({
          text:
            response.message ||
            (isEditMode ? "Failed to update event" : "Failed to create event"),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setMessage({ text: "Error: " + error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <h2>{isEditMode ? "Edit Event ✏️" : "Create New Event 🌸"}</h2>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="event-form">
        {/* Event Title */}
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Tech Sisters Meetup"
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="short_description">Description</label>
          <textarea
            id="short_description"
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Share a short intro about your event (you can add more details after creating it)."
          />
        </div>
        {isEditMode && (
          <div className="form-group">
            <label htmlFor="long_description">Additional Event Details</label>
            <textarea
              id="long_description"
              name="long_description"
              value={formData.long_description}
              onChange={handleChange}
              rows="6"
              placeholder="Add more details about your event..."
            />
          </div>
        )}

        {/* Event Date & Time */}
        <div className="form-group">
          <label htmlFor="event_datetime">Event Date & Time</label>
          <input
            type="datetime-local"
            id="event_datetime"
            name="event_datetime"
            value={formData.event_datetime}
            onChange={handleChange}
            required
          />
          <small className="helper-text">
           <strong>{timezoneAbbr}</strong> (
            {userTimezone})
          </small>
        </div>

        {/* Timezone - Now auto-detected and hidden */}
        <input type="hidden" name="timezone" value={formData.timezone} />

        {/* Event Type */}
        <div className="form-group">
          <label htmlFor="event_type">Event Type</label>
          <select
            id="event_type"
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            required
          >
            <option value="online">Online</option>
            <option value="in-person">In-Person</option>
          </select>
        </div>

        {/* Event Link / Location */}
        {formData.event_type === "online" ? (
          <div className="form-group">
            <label htmlFor="event_link">Event Link (Online)</label>
            <input
              type="url"
              id="event_link"
              name="event_link"
              value={formData.event_link}
              onChange={handleChange}
              placeholder="https://zoom.com/meeting (you can add this later also)"
              
            />
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="event_location">Event Location (In-Person)</label>
            <input
              type="text"
              id="event_location"
              name="event_location"
              value={formData.event_location}
              onChange={handleChange}
              placeholder="123 Street, City, Country"
              required
            />
          </div>
        )}

        {/* Host Email */}
        <div className="form-group">
          <label htmlFor="event_host_email">Host Email</label>
          <input
            type="email"
            id="event_host_email"
            name="event_host_email"
            value={formData.event_host_email}
            onChange={handleChange}
            placeholder="host@example.com"
          />
        </div>

        {/* Duration */}
        <div className="form-group">
          <label htmlFor="duration">Duration (minutes)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., 60"
            min="1"
          />
        </div>

        {/* Tags */}
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., AI, Tech, Community"
          />
          <small className="helper-text">Separate tags with commas</small>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => (isEditMode ? navigate(-1) : navigate("/dashboard"))}
            disabled={isLoading}
          >
            Cancel
          </button>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading
              ? isEditMode
                ? "Updating Event..."
                : "Creating Event..."
              : isEditMode
              ? "Update Event ✏️"
              : "Create Event 🎉"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEventForm;
