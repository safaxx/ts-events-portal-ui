// This file handles all API calls to your Spring Boot backend
import api from '../Services/ApiRequestInterceptor';
import axios from 'axios';

// base url for public apis, we cannot use "api" as it has the jwt interceptor
const PUBLIC_API_BASE_URL = 'http://localhost:8080/api/v1/public/events';

const eventService = {

  /**
   * Creates a new event.
   * @param {object} eventData - The event data to send.
   * @returns {Promise<object>} The data from the API response.
   */
  createEvent: async (eventData) => {
    try {
      // Use 'api.post'
      // - 1st arg: The relative path (assuming 'api' is configured to '.../api')
      // - 2nd arg: The data object (axios handles stringify)
      const response = await api.post('/events/create-new', eventData);
      
      // axios puts the response data in the 'data' property
      return response.data;

    } catch (error) {
      // This catch block will now handle non-auth errors (like 400, 500)
      const message = error.response?.data?.message || error.message || 'Failed to create event';
      console.error('Error creating new event: ', message);
      throw new Error(message);
    }
  },

  /**
   * Fetches all events.
   * @returns {Promise<object>} The data from the API response.
   */
  getAllEvents: async () => {
    try {
      // Use 'api.get'
      // - No headers, method, or body needed
      const response = await axios.get(`${PUBLIC_API_BASE_URL}/all`);
      
      // axios puts the response data in the 'data' property
      return response.data;

    } catch (error) {
      // This catch block will now handle non-auth errors
      const message = error.response?.data?.message || error.message || 'Failed to fetch events';
      console.error('Error fetching events:', message);
      throw new Error(message);
    }
  },
  
  /**
   * Fetches a single event by ID.
   * @param {number} eventId - The event ID
   * @returns {Promise<object>} The event data
   */
  getEventById: async (eventId) => {
    try {
      const response = await axios.get(`${PUBLIC_API_BASE_URL}/id?eventId=${eventId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch event';
      console.error('Error fetching event:', message);
      throw new Error(message);
    }
  },
 /**
   * Submit RSVP for an event.
   * @param {number} eventId - The event ID
   * @param {boolean} rsvp - RSVP status (true = attending)
   * @returns {Promise<object>} The response data
   */
  rsvpToEvent: async (eventId, rsvp = true) => {
    try {
      const response = await api.post('/api/v1/events/rsvp', {
        event_id: eventId,
        rsvp: rsvp,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to RSVP';
      console.error('Error submitting RSVP:', message);
      throw new Error(message);
    }
  },
   /**
   * Get user's RSVPs.
   * @returns {Promise<object>} List of events the user has RSVP'd to
   */
  getMyRSVPs: async () => {
    try {
      const response = await api.get('/api/v1/events/my-rsvps');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch RSVPs';
      console.error('Error fetching RSVPs:', message);
      throw new Error(message);
    }
  },


};

export default eventService;