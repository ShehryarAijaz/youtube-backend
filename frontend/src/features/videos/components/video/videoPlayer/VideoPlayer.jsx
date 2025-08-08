import React, { useState ,useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getVideoById } from '@/features/videos/api'

const VideoPlayer = () => {

    const [video, setVideo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const { videoId } = useParams()

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                setLoading(true)
                const response = await getVideoById(videoId)
                setVideo(response.data)
            } catch (error) {
                console.error("Error fetching video:", error.message)
                setError('Failed to load video')
            } finally {
                setLoading(false)
            }
        }
        fetchVideo()
    }, [])
    
  return (
    <div className="relative w-full">
      <div className="relative aspect-video">
        {loading ? (
          <div className="w-full h-full rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
        ) : error ? (
          <div className="w-full h-full rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            {error}
          </div>
        ) : (
          <video
              src={video?.videoFile}
              poster={video?.thumbnail}
              controls
              controlsList="nodownload"
              className="w-full h-full object-cover rounded-lg"
              preload="metadata"
              playsInline
            >
              Your browser does not support the video tag.
            </video>
        )}
      </div>
    </div>
  )
}

export default VideoPlayer