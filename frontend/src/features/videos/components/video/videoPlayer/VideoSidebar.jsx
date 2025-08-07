import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getVideos } from '@/features/videos/api'

const VideoSidebar = () => {
    const [allVideos, setAllVideos] = useState([])
    const [query, setQuery] = useState("")

    useEffect(() => {
        const fetchAllVideos = async () => {
            try {
                const response = await getVideos(query)
                if (response?.status === 200) {
                    setAllVideos(response?.data?.videos)
                }
                else {
                    throw new Error("Failed to fetch recommended videos")
                }
            } catch (error) {
                console.error("Error fetching recommended videos:", error.message)
            }
        }
        fetchAllVideos()
    }, [])
  return (
    <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommended</h2>
        <div className="space-y-4">
            {allVideos.map((video) => (
                <div key={video._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                    <div className="flex items-center mb-2">
                        <img src={video.thumbnail} alt={video.title} className="w-8 h-8 rounded-full mr-2" />
                        <span className="font-semibold">{video.title}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default VideoSidebar