import React, { useState } from "react";
import "./AddEventForm.css";
import eventService from "../../Services/EventService";

function AddEventForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    organizer_email: "",
    event_datetime: "",
    timezone: "UTC",
    event_type: "online",
    event_host_email: "",
    tags: "",
    duration: "",
  });

  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const convertToISO8601 = (datetimeLocal, timezone) => {
    // Add seconds to the datetime if not present
    const dateTimeWithSeconds = datetimeLocal.includes(":00:00")
      ? datetimeLocal
      : datetimeLocal + ":00";

    // Timezone offset mapping
    const timezoneOffsets = {
      UTC: "+00:00",
      "America/New_York": "-05:00",
      "America/Chicago": "-06:00",
      "America/Los_Angeles": "-08:00",
      "Asia/Kolkata": "+05:30",
      "Europe/London": "+00:00",
    };

    const offset = timezoneOffsets[timezone] || "+00:00";
    return `${dateTimeWithSeconds}${offset}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formattedData = {
        ...formData,
        event_datetime: convertToISO8601(
          formData.event_datetime,
          formData.timezone
        ),
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
          timezone: "UTC",
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
            Select date and time in your selected timezone
          </small>
        </div>
        {/* Timezone */}
        <div className="form-group">
          <label htmlFor="timezone">Timezone</label>
          <select
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Asia/Kolkata">India Standard Time</option>
            <option value="Europe/London">London</option>
          </select>
        </div>

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
