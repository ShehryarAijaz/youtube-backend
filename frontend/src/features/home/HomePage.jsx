import { useAuthStore } from "@/store/auth";

const HomePage = () => {

    const { user } = useAuthStore()

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {user ? <h1 className="text-2xl font-bold">Welcome {user.fullName}</h1> : <h1 className="text-2xl font-bold">Please login or register to continue</h1>}
        </div>
    )
}

export default HomePage;