import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { publishVideo } from "./api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

function PublishVideo() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, videoFile: file });
    }
  };
  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, thumbnail: file });
    }
  };

  const handlePublishChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePublishSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("videoFile", formData.videoFile);
    data.append("thumbnail", formData.thumbnail);

    try {
      const response = await publishVideo(data);
      console.log("Response", response);
      if (response?.status === 201) {
        setError(null);
        setSuccess(true);
        setSuccessMessage(
          response.data.message || "Video published successfully"
        );
      }
    } catch (error) {
      console.log("Error", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 gap-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Publish Video</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePublishSubmit} className="flex flex-col gap-4">
            <Input
              name="title"
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={handlePublishChange}
            />
            <Input
              name="description"
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={handlePublishChange}
            />
            <Input
              name="videoFile"
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
            />
            <Input
              name="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "Publishing..." : "Publish"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {success && (
        <Alert className="mt-4">
          <CheckCircle2Icon />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default PublishVideo;
