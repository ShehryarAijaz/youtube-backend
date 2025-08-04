import { useAuthStore } from "@/store/auth";
import VideoList from "@/features/videos/VideoList";

const HomePage = () => {

    const { user } = useAuthStore()

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {user ? <div className="w-full h-full flex flex-col items-center justify-center">
                <VideoList />
            </div> : <div className="w-full h-full flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Please login or register to continue</h1>
            </div>}
        </div>
    )
}

export default HomePage;