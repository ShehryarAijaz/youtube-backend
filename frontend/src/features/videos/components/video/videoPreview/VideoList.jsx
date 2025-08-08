import React, { useEffect, useMemo, useState } from "react";
import { getVideos } from "@/features/videos/api";
import Video from "@/features/videos/components/video/videoPreview/Video";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const VideoCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="w-full aspect-video rounded-xl bg-gray-200 dark:bg-gray-800" />
    <div className="flex gap-3 mt-3">
      <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-800" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mt-2" />
      </div>
    </div>
  </div>
);

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  const queryString = useMemo(() => {
    const parts = [];
    if (search) parts.push(`search=${encodeURIComponent(search)}`);
    return parts.join('&');
  }, [search]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await getVideos(queryString);
        setVideos(response.data?.videos || []);
      } catch (err) {
        console.error("Error fetching videos:", err.message);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [queryString]);

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="flex items-center justify-center gap-2 p-4">
        <Input
          className="max-w-xl"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setSearch(query)}
        />
        <Button
          variant="default"
          onClick={() => setSearch(query)}
        >
          Search
        </Button>
      </div>

      {/* Videos grid */}
      <div className="px-4 pb-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
            {Array.from({ length: 10 }).map((_, idx) => (
              <VideoCardSkeleton key={idx} />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 text-gray-600 dark:text-gray-400">
            <div className="text-2xl font-semibold">No videos found</div>
            <div className="mt-2">Try different keywords or categories</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
            {videos.map((video) => (
              <Video key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoList;
