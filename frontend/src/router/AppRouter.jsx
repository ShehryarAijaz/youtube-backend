import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/features/auth/components/LoginPage";
import RegisterPage from "@/features/auth/components/RegisterPage";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import HomePage from "@/features/home/HomePage"
import Navbar from "@/features/navigation/Navbar"
import UserPage from "@/features/user/components/UserPage"
import UpdateAccount from "@/features/user/components/UpdateAccount"
import PublishVideo from "@/features/videos/components/video/videoPreview/PublishVideo"
import PublishTweet from "@/features/tweets/components/TweetPublish"
import TweetUpdate from "@/features/tweets/components/TweetUpdate"
import VideoWatchPage from "@/features/videos/components/video/videoPlayer/VideoWatchPage"

export default function AppRouter() {
    return (
        <ThemeProvider>
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/user" element={<UserPage />} />
                <Route path="/update-account" element={<UpdateAccount />} />
                <Route path="/publish-video" element={<PublishVideo />} />
                <Route path="/publish-tweet" element={<PublishTweet />} />
                <Route path="/update-tweet/:tweetId" element={<TweetUpdate />} />
                <Route path="/watch/:videoId" element={<VideoWatchPage />} />
            </Routes>
        </BrowserRouter>
        </ThemeProvider>
    )
}