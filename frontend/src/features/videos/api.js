import api from "@/services/api";

export const getVideos = async (query) => {
  try {
    const response = await api.get(`/videos/all-videos?${query}`);
    if (response?.status === 200) {
      return response;
    } else {
      throw new Error(response.message || "Failed to fetch videos");
    }
  } catch (error) {
    throw new Error(error.message || "Failed to fetch videos");
  }
};

export const publishVideo = async (formData) => {
  try {
    const response = await api.post("/videos/publish-video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (response?.status === 201) {
      return response;
    }
  } catch (error) {
    throw new Error(error.message || "Failed to publish video");
  }
};

export const getVideoById = async (videoId) => {
  try{
    const response = await api.get(`/videos/get-video/${videoId}`)
    if (response?.status === 200) {
      return response
    } else {
      throw new Error(response.message || "Failed to fetch video")
    }
  } catch (error) {
    throw new Error(error.message || "Failed to fetch video")
  }
}