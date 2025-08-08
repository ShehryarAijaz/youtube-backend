import React from "react";
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const formatViews = (num) => {
  if (num == null) return '0 views';
  if (num < 1000) return `${num} views`;
  const units = ['K', 'M', 'B', 'T'];
  let unitIndex = -1;
  let value = num;
  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000;
    unitIndex++;
  }
  return `${value.toFixed(value >= 10 || value % 1 === 0 ? 0 : 1)}${units[unitIndex]} views`;
};

const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return '';
  const total = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hrs > 0) return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

const timeSince = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  const intervals = [
    { label: 'year', secs: 31536000 },
    { label: 'month', secs: 2592000 },
    { label: 'week', secs: 604800 },
    { label: 'day', secs: 86400 },
    { label: 'hour', secs: 3600 },
    { label: 'minute', secs: 60 },
  ];
  for (const { label, secs } of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

const Video = ({ video }) => {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/watch/${video._id}`);
  };

  const titleInitial = (video?.title || 'V').charAt(0).toUpperCase();

  return (
    <div
      className="group cursor-pointer"
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' ? handleOpen() : null)}
    >
      {/* Thumbnail */}
      <div className="relative w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800">
        <img
          src={video?.thumbnail}
          alt={video?.title}
          className="h-full w-full object-cover aspect-video transition-transform duration-200 group-hover:scale-[1.02]"
          loading="lazy"
        />
        {/* Duration */}
        {video?.duration != null && (
          <span className="absolute bottom-2 right-2 text-xs font-semibold bg-black/80 text-white px-1.5 py-0.5 rounded">
            {formatDuration(Number(video.duration))}
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex gap-3 mt-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={video?.owner?.avatar} alt={video?.owner?.username} />
          <AvatarFallback>{titleInitial}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 leading-tight line-clamp-2">
            {video?.title}
          </h3>
          <div className="mt-1 text-[13px] text-gray-600 dark:text-gray-400">
            <div className="truncate">{video?.owner?.username || 'Unknown channel'}</div>
            <div className="flex items-center gap-1.5">
              <span>{formatViews(video?.views)}</span>
              <span>•</span>
              <span>{timeSince(video?.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
