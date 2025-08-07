import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getVideoById } from "@/features/videos/api";

const VideoInfo = () => {

    const { videoId } = useParams()
    const [videoInfo, setVideoInfo] = useState(null)

    useEffect(() => {
        const fetchVideoInfo = async () => {
            try {
                const response = await getVideoById(videoId)
                if (response?.status === 200) {
                    setVideoInfo(response?.data)
                }
                else {
                    throw new Error("Failed to fetch video info")
                }
            } catch (error) {
                console.error("Error fetching video info:", error.message)
            }
        }
        fetchVideoInfo()
    }, [])

  return (
    <div className="space-y-4">
      {/* Video title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white leading-tight">
          {videoInfo?.title || "Loading..."}
        </h1>
      </div>
      
      {/* Video stats and actions */}
      <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span>{videoInfo?.views || 0} views</span>
          <span>•</span>
          <span>{videoInfo?.createdAt ? new Date(videoInfo.createdAt).toLocaleDateString() : "Unknown date"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span>Like</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>Share</span>
          </button>
        </div>
      </div>
      
      {/* Video description */}
      <div className="py-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {videoInfo?.description || "No description available."}
          </p>
        </div>
      </div>
    </div>
  )
};

export default VideoInfo;