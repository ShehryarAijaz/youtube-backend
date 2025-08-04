import api from "@/services/api";

export const getVideos = async (query) => {
    try {
        const response = await api.get(`/videos/all-videos?${query}`)
        if (response?.status === 200) {
            return response.data
        } else {
            throw new Error(response.data.message)
        }
    } catch (error) {
        throw new Error(error.message)
    }
}