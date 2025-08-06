import React from "react";

const Video = ({ video }) => {
  return (
    <div className="border rounded p-4 shadow-sm">
      <video
        src={video.videoFile}
        poster={video.thumbnail}
        controls
        className="w-full rounded"
      />
      <h2 className="mt-2 text-lg font-semibold">{video.title}</h2>
      <p className="text-sm text-gray-600">{video.description}</p>
      <div className="text-xs text-gray-400 mt-1">
        Duration: {video.duration.toFixed(2)} sec | Views: {video.views}
      </div>
    </div>
  );
};

export default Video;
