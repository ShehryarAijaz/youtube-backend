import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTweetById, updateTweet } from "@/features/tweets/api";
import { useParams } from "react-router-dom";

const TweetUpdate = () => {
  const { tweetId } = useParams();
  const [formData, setFormData] = useState({
    content: "",
  });
  const [tweet, setTweet] = useState(null);
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

  useEffect(() => {
    const fetchTweet = async () => {
      const response = await getTweetById(tweetId);
      if (response?.status === 200) {
          setTweet(response.data?.content);
          setFormData({ content: response.data?.content });
      } else {
        setError(response.message);
      }
    };
    fetchTweet();
  }, [tweetId]);

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      const response = await updateTweet(tweetId, formData);
      if (response?.status === 200) {
        setError(null);
        setSuccess(true);
        setLoading(false);
        setFormData({ content: "" });
        setSuccessMessage("Tweet updated successfully!");
      }
    } catch (error) {
      setError(
        error.message || "An error occurred while updating the tweet."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTweetChange = (e) => {
    setFormData({ ...formData, content: e.target.value });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Update Tweet</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTweetSubmit} className="w-full max-w-md p-4">
            <Input
              type="text"
              placeholder="Update tweet..."
              value={formData.content}
              onChange={handleTweetChange}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button className="mt-3" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
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
};

export default TweetUpdate;
