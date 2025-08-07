import React, { useEffect, useState } from "react";
import { getVideos } from "@/features/videos/api";
import Video from "@/features/videos/components/video/videoPreview/Video";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await getVideos(query);
        setVideos(response.data?.videos || []);
      } catch (err) {
        console.error("Error fetching videos:", err.message);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [search]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Search bar at the top */}
      <div className="flex items-center justify-center gap-2 p-4 border-b">
        <Input
          className="w-64"
          placeholder="Search videos"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          variant="outline"
          onClick={() => {
            setSearch(query);
            setQuery("");
          }}
        >
          Search
        </Button>
      </div>

      {/* Videos grid below */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <Video key={video._id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoList;
