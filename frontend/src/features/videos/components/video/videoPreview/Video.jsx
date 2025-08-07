import React from "react";
import { useNavigate } from 'react-router-dom'

const Video = ({ video }) => {
  const navigate = useNavigate();

  const handleUpdate = () => {
    navigate(`/watch/${video._id}`);
  }

  return (
    <div className="border rounded p-4 shadow-sm" onClick={handleUpdate}>
      <video
        src={video.videoFile}
        poster={video.thumbnail}
        controls
        className="w-full rounded"
      />
      <div className="flex flex-col cursor-pointer">
      <h2 className="mt-2 text-lg font-semibold">{video.title}</h2>
      <p className="text-sm text-gray-600">{video.description}</p>
      <div className="text-xs text-gray-400 mt-1">
        Duration: {video.duration.toFixed(2)} sec | Views: {video.views}
      </div>
      </div>
    </div>
  );
};

export default Video;
