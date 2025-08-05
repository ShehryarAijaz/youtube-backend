import React, { useState } from 'react'
import Tweet from "@/features/tweets/components/Tweet";
import { useAuthStore } from '@/store/auth';
import { getTweets } from '@/features/tweets/api';
import Tweet from "@/features/tweets/components/Tweet";

const TweetList = () => {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useAuthStore();
    
    useEffect(() => {
        const fetchTweets = async () => {
          try {
            const response = await getTweets(user._id);
            console.log("API Response:", response);
            setTweets(response.data?.tweets || []);
          } catch (err) {
            console.error("Error fetching videos:", err.message);
            setTweets([]);
          } finally {
            setLoading(false);
          }
        };
    
        fetchTweets();
      }, []);

      return (
        <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tweets.map((tweet) => (
            <Tweet key={tweet._id} content={tweet} />
          ))}
        </div>
      </div>
      )
}

export default TweetList