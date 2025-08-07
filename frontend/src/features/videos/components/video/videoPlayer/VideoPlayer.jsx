import React, { useState ,useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getVideoById } from '@/features/videos/api'

const VideoPlayer = () => {

    const [video, setVideo] = useState("")
    const { videoId } = useParams()

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await getVideoById(videoId)
                setVideo(response.data)
            } catch (error) {
                console.error("Error fetching video:", error.message)
            }
        }
        fetchVideo()
    }, [])
    
  return (
    <div className="relative w-full">
      <div className="relative aspect-video">
        <video
            src={video?.videoFile}
            poster={video?.thumbnail}
            controls
            className="w-full h-full object-cover rounded-lg"
            preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}

export default VideoPlayer