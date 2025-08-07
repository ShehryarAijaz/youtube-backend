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
                console.log("response", response.data)
                setVideo(response.data)
            } catch (error) {
                console.error("Error fetching video:", error.message)
            }
        }
        fetchVideo()
    }, [])
    
  return (
    <div>
        <video
            src={video?.videoFile}
            poster={video?.thumbnail}
            controls
            width="100%"
            height="100%"
        ></video>
    </div>
  )
}

export default VideoPlayer