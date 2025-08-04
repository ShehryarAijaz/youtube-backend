import React, { useEffect, useState } from "react";
import { getVideos } from "./api";
import Video from "./Video";
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
        const data = await getVideos(query);
        setVideos(data.videos || []);
      } catch (err) {
        console.error("Error fetching videos:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [search]);

  console.log("Videos", videos.length);
  console.log("Loading", loading);
  console.log("Query", query);
  console.log("Search", search);

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
