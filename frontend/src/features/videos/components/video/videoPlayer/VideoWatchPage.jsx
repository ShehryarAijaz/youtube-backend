import React from 'react'
import VideoPlayer from '@/features/videos/components/video/videoPlayer/VideoPlayer'
import VideoInfo from '@/features/videos/components/video/videoPlayer/VideoInfo'
import CommentSection from '@/features/videos/components/video/videoPlayer/CommentSection'
import VideoSidebar from '@/features/videos/components/video/videoPlayer/VideoSidebar'

const VideoWatchPage = () => {
  return (
    <div className="min-h-screen  ">
      {/* Main container */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column - Video player and info */}
          <div className="flex-1 lg:max-w-[calc(100%-400px)]">
            {/* Video player container */}
            <div className="bg-black rounded-lg overflow-hidden shadow-lg mb-4">
              <VideoPlayer />
            </div>
            
            {/* Video info section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <VideoInfo />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <CommentSection />
            </div>
          </div>
          
          {/* Right column - Recommended videos */}
          <div className="lg:w-80 flex-shrink-0">
            <VideoSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoWatchPage