import React from 'react'
import VideoPlayer from './VideoPlayer'
import { useParams } from 'react-router-dom'

const VideoWatchPage = () => {
    const { videoId } = useParams()

  return (
    <div className="w-full h-screen flex justify-center items-center">
        <div className="flex w-full">
            <div className="sticky top-[64px] left-0 w-[900px] max-w-full bg-black rounded-lg shadow-lg mt-2 ml-4 z-10">
                <VideoPlayer videoId={videoId} />
            </div>
        </div>
    </div>
  )
}

export default VideoWatchPage