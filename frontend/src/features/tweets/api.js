import api from "@/services/api";

export const publishTweet = async (tweetContent) => {
  try {
    const response = await api.post("/create-tweet", tweetContent);
    if (response?.status === 201) {
      return response;
    } else {
      throw new Error(response.message || "Failed to fetch videos");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to fetch videos");
  }
};

export const getTweets = async (userId) => {
  try {
    const response = await api.get(`/user-tweets/${userId}`);
    if (response?.status === 200) {
      return response;
    } else {
      throw new Error(response.message || "Failed to fetch tweets");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to fetch tweets");
  }
};
