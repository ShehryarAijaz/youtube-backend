import api from "@/services/api";

export const publishTweet = async ({ content }) => {
  try {
    const response = await api.post("/tweets/create-tweet", { content });
    if (response?.status === 201) {
      return response;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getTweets = async (userId) => {
  try {
    const response = await api.get(`/tweets/user-tweets/${userId}`);
    if (response?.status === 200) {
      return response;
    } else {
      throw new Error(response.message || "Failed to fetch tweets");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to fetch tweets");
  }
};
