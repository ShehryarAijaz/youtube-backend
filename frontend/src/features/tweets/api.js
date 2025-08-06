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

export const updateTweet = async (tweetId, { content }) => {
  try {
    const response = await api.patch(`/tweets/update-tweet/${tweetId}`, { content });
    if (response?.status === 200) {
      return response;
    } else {
      throw new Error(response.message || "Failed to update tweet");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to update tweet");
  }
};

export const getTweetById = async (tweetId) => {
  try {
    const response = await api.get(`/tweets/get-tweet/${tweetId}`)
    if (response?.status === 200) {
      return response
    }
  } catch (error) {
    throw new Error(error.message || "Failed to fetch tweet");
  }
}