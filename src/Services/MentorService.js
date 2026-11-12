import api from "./ApiRequestInterceptor";

export const mentorService =  {
  getAllMentors: async () => {
    try {
      const response = await api.get("/public/mentors");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch mentors";
      console.error("Error fetching mentors:", message);
      throw new Error(message);
    }
  }
};
