import { useAuthStore } from "@/store/auth";
import VideoList from "@/features/videos/components/VideoList";
import TweetList from "@/features/tweets/components/TweetList";

const HomePage = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen w-full">
      {user ? (
        <div className="w-full p-4">
          {/* Videos Section */}
          <div className="mb-8 border-b-2 pb-4">
            <VideoList />
          </div>
          
          {/* Tweets Section */}
          <div className="mb-8 border-b-2 pb-4">
            <TweetList />
          </div>
        </div>
      ) : (
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">
            Please login or register to continue
          </h1>
        </div>
      )}
    </div>
  );
};

export default HomePage;
