import { useNavigate } from "react-router-dom";

const HomePage = () => {

    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        navigate('/register')
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {user ? <h1 className="text-2xl font-bold">Welcome {user.fullName}</h1> : <h1 className="text-2xl font-bold">Please login or register to continue</h1>}
        </div>
    )
}

export default HomePage;