import DownloadIcon from '@mui/icons-material/Download'; // Import the icon
import ICalendarLink from "react-icalendar-link";
import "./DownloadEvent.css";

const downloadICS = ({ eventData }) => {
  // eventData should follow the library's expected structure


  // 1. Create a Date object from the startTime string
  const start = new Date(eventData.eventDateTime);
  
  // 2. Calculate the end time by adding duration (in minutes) to the start time
  // getTime() returns milliseconds, so we multiply duration by 60,000
  const end = new Date(start.getTime() + eventData.duration * 60000);

  const event = {
    title: eventData.title || 'Sample Event',
    description: eventData.shortDescription,
    location: eventData.eventLink,
    startTime: eventData.eventDateTime, // Use ISO format with timezone
    endTime: end.toISOString(), // Use ISO format with timezone
    duration: { minutes: eventData.duration },
    organizer: { name: eventData.eventHostName, email: eventData.eventHostEmail }
  };

// Clean the title for use as a filename (removes special characters)
  const safeTitle = (eventData.title || 'event').replace(/[^a-z0-9]/gi, '_').toLowerCase();

  return (
    <ICalendarLink className="calendar-btn" event={event} filename={`${safeTitle}.ics`}>
      <DownloadIcon fontSize="small" />
      <span>Download Event</span>
    </ICalendarLink>
  );
 };

export default downloadICS;