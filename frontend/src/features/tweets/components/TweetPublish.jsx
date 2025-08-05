import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

const TweetPublish = () => {
  const [tweetContent, setTweetContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSucess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSucess(false);

    try {
      const response = await publishTweet(tweetContent);
      if (response.status === 201) {
        setError(null);
        setSucess(true);
        setSuccessMessage("Tweet published successfully!");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while publishing the tweet."
      );
    }
  };

  const handleTweetChange = (e) => {
    setTweetContent(e.target.value);
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
              value={tweetContent}
              onChange={handleTweetChange}
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
};

export default TweetPublish;
