/**
 * Gets the user's current timezone
 * @returns {string} Timezone identifier (e.g., "America/New_York")
 */
export const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Converts an ISO datetime string to the user's local timezone
 * @param {string} isoDateTimeString - ISO 8601 datetime string from backend
 * @returns {Date} Date object in user's timezone
 */
export const convertToUserTimezone = (isoDateTimeString) => {
  if (!isoDateTimeString) return null;
  return new Date(isoDateTimeString);
};


/**
 * Formats a datetime for display
 * @param {string} isoDateTimeString - ISO datetime from backend
 * @param {object} options - Formatting options
 * @returns {object} Formatted date and time strings
 */
export const formatEventDateTime = (isoDateTimeString, options = {}) => {
  const date = convertToUserTimezone(isoDateTimeString);
  
  if (!date) return { date: '', time: '', fullDateTime: '', dayOfWeek: '' };

  const {
    includeYear = true,
    includeWeekday = true,
    timeFormat = '12hour'
  } = options;

  // Format date
  const dateOptions = {
    year: includeYear ? 'numeric' : undefined,
    month: 'short',
    day: 'numeric',
    weekday: includeWeekday ? 'short' : undefined,
  };

  // Format time
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: timeFormat === '12hour',
  };

  const formattedDate = date.toLocaleDateString('en-US', dateOptions);
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
  
  // Full datetime for display
  const fullDateTime = date.toLocaleString('en-US', {
    ...dateOptions,
    ...timeOptions,
  });

  // Day of week separately
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

  return {
    date: formattedDate,
    time: formattedTime,
    fullDateTime,
    dayOfWeek,
    dateObject: date,
  };
};

/**
 * Checks if an event is happening today
 * @param {string} isoDateTimeString 
 * @returns {boolean}
 */
export const isToday = (isoDateTimeString) => {
  const eventDate = convertToUserTimezone(isoDateTimeString);
  const today = new Date();
  
  return (
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear()
  );
};

/**
 * Checks if an event is happening tomorrow
 * @param {string} isoDateTimeString 
 * @returns {boolean}
 */
export const isTomorrow = (isoDateTimeString) => {
  const eventDate = convertToUserTimezone(isoDateTimeString);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return (
    eventDate.getDate() === tomorrow.getDate() &&
    eventDate.getMonth() === tomorrow.getMonth() &&
    eventDate.getFullYear() === tomorrow.getFullYear()
  );
};

/**
 * Gets a relative time description
 * @param {string} isoDateTimeString 
 * @returns {string} "Today", "Tomorrow", or formatted date
 */
export const getRelativeDate = (isoDateTimeString) => {
  if (isToday(isoDateTimeString)) return 'Today';
  if (isTomorrow(isoDateTimeString)) return 'Tomorrow';
  
  const { date } = formatEventDateTime(isoDateTimeString, { includeYear: false });
  return date;
};

/**
 * Calculates time remaining until event
 * @param {string} isoDateTimeString 
 * @returns {string} Human-readable time remaining
 */
export const getTimeUntilEvent = (isoDateTimeString) => {
  const eventDate = convertToUserTimezone(isoDateTimeString);
  const now = new Date();
  const diffMs = eventDate - now;
  
  if (diffMs < 0) return 'Event has passed';
  
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
  if (diffHours > 0) return `In ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  if (diffMinutes > 0) return `In ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  
  return 'Starting soon!';
};

/**
 * Formats timezone name for display
 * @param {string} timezone - IANA timezone identifier
 * @returns {string} Formatted timezone abbreviation
 */
export const getTimezoneAbbreviation = (timezone = getUserTimezone()) => {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    });
    
    const parts = formatter.formatToParts(date);
    const timeZonePart = parts.find(part => part.type === 'timeZoneName');
    
    return timeZonePart ? timeZonePart.value : timezone;
  } catch (error) {
    console.error('Error formatting timezone:', error);
    return timezone;
  }
};

/**
 * Converts user's local datetime to ISO format for API submission
 * @param {string} localDateTimeString - From datetime-local input
 * @param {string} timezone - Optional timezone override
 * @returns {string} ISO 8601 formatted string
 */
export const convertLocalToISO = (localDateTimeString, timezone = getUserTimezone()) => {
  if (!localDateTimeString) return '';
  
  // Create a date object from the local datetime string
  const date = new Date(localDateTimeString);
  
  // Return ISO string (already in UTC)
  return date.toISOString();
};