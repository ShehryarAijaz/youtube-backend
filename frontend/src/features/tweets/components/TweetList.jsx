import React, { useState, useEffect } from 'react'
import Tweet from "@/features/tweets/components/Tweet";
import { useAuthStore } from '@/store/auth';
import { getTweets } from '@/features/tweets/api';

const TweetList = () => {
    const [tweets, setTweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const { user } = useAuthStore();
    
    useEffect(() => {
      const fetchTweets = async () => {
        try {
          const response = await getTweets(user._id);
          setTweets(response.data);
        } catch (err) {
          console.error("Error fetching tweets:", err.message);
          setTweets([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchTweets();
    }, []);

      return (
        <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tweets.map((tweet) => (
            <Tweet key={tweet._id} tweet={tweet} />
          ))}
        </div>
      </div>
      )
}

export default TweetList