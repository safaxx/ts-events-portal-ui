// This file handles all API calls to your Spring Boot backend

const API_BASE_URL = 'http://localhost:8080';

const eventService = {

    createEvent: async (eventData)=>{
        try{
            const response = await fetch(`${API_BASE_URL}/events/create-new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });
            const data = response.json();
            if(!response.ok){
                throw new Error(data.message || 'Failed to create event');
            }
            return data;
        }catch(error){
            console.error('Error creating new event: ', error);
            throw error;
        }
    },

    getAllEvents: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch events');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },


};

export default eventService;