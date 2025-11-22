import React, { useState, useEffect } from "react";
import "./AddEventForm.css";
import eventService from "../../Services/EventService";
import { getUserTimezone, getTimezoneAbbreviation } from "../../../utils/TimeZoneUtils";

function AddEventForm() {
  const [userTimezone, setUserTimezone] = useState(getUserTimezone());
  const [timezoneAbbr, setTimezoneAbbr] = useState('');

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    organizer_email: "",
    event_datetime: "",
    timezone: "",
    event_type: "online",
    event_host_email: "",
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
    setFormData(prev => ({
      ...prev,
      timezone: tz
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  /**
   * Converts the datetime-local input to ISO 8601 format with timezone
   */
  const convertToISO8601 = (datetimeLocal) => {
    if (!datetimeLocal) return '';
    
    // The datetime-local input gives us a string like "2025-11-22T18:00"
    // We need to convert this to ISO 8601 with the user's timezone offset
    
    // Create a date object in the user's local timezone
    const date = new Date(datetimeLocal);
    
    // Get the ISO string (this is in UTC)
    const isoString = date.toISOString();
    
    return isoString;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formattedData = {
        ...formData,
        event_datetime: convertToISO8601(formData.event_datetime),
        timezone: userTimezone, // Send the actual timezone name
      };

      const response = await eventService.createEvent(formattedData);
      if (response.success) {
        setMessage({ text: "Event created successfully!", type: "success" });
        // Reset form
        setFormData({
          title: "",
          description: "",
          organizer_email: "",
          event_datetime: "",
          timezone: userTimezone,
          event_type: "online",
          event_host_email: "",
          tags: "",
          duration: "",
        });
      } else {
        setMessage({
          text: response.message || "Failed to create event",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({ text: "Error: " + error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event-container">
      <h2>Create New Event 🌸</h2>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="event-form">
        {/* Event Title */}
        <div className="form-group">
          <label htmlFor="title">Event Title *</label>
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
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Tell us about your event..."
          />
        </div>

        {/* Organizer Email */}
        <div className="form-group">
          <label htmlFor="organizer_email">Organizer Email *</label>
          <input
            type="email"
            id="organizer_email"
            name="organizer_email"
            value={formData.organizer_email}
            onChange={handleChange}
            required
            placeholder="organizer@example.com"
          />
        </div>

        {/* Event Date & Time */}
        <div className="form-group">
          <label htmlFor="event_datetime">Event Date & Time *</label>
          <input
            type="datetime-local"
            id="event_datetime"
            name="event_datetime"
            value={formData.event_datetime}
            onChange={handleChange}
            required
          />
          <small className="helper-text">
            🌍 Time will be in your timezone: <strong>{timezoneAbbr}</strong> ({userTimezone})
          </small>
        </div>

        {/* Timezone - Now auto-detected and hidden */}
        <input 
          type="hidden" 
          name="timezone" 
          value={formData.timezone} 
        />

        {/* Event Type */}
        <div className="form-group">
          <label htmlFor="event_type">Event Type *</label>
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

        {/* Submit Button */}
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Creating Event..." : "Create Event 🎉"}
        </button>
      </form>
    </div>
  );
}

export default AddEventForm;