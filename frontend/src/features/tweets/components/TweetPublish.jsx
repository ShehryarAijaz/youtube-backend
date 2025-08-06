import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publishTweet } from "@/features/tweets/api";

const TweetPublish = () => {
  const [formData, setFormData] = useState({
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  console.log("Content: ", formData, typeof formData);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);

    try {
      const response = await publishTweet(formData);
      if (response?.status === 201) {
        setError(null);
        setSuccess(true);
        setLoading(false);
        setFormData({ content: "" });
        setSuccessMessage("Tweet published successfully!");
      }
    } catch (error) {
      setError(
        error.message || "An error occurred while publishing the tweet."
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
          <CardTitle>Publish Tweet</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTweetSubmit} className="w-full max-w-md p-4">
            <Input
              type="text"
              placeholder="What's happening?"
              value={formData.content}
              onChange={handleTweetChange}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button className="mt-3" type="submit" disabled={loading}>
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
};

export default TweetPublish;
