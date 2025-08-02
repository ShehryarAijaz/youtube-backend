import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser } from "./api";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const setUser = useAuthStore((state) => state.setUser)
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            console.log("Submitting login with formData:", formData)
            const response = await loginUser(formData)
            console.log("loginUser response:", response)
            if (response.status === 200) {
                setUser(response.data.user)
                console.log("User set in store, navigating to /")
                try {
                    navigate("/")
                    console.log("navigate('/') called")
                } catch (navErr) {
                    console.error("Error during navigate:", navErr)
                }
            } else {
                console.error("Login failed, response status:", response.status, "response:", response)
                setError("Login failed. Please check your credentials.")
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    // Extra logs for debugging
    console.log("formData", formData)
    console.log("loading", loading)
    console.log("error", error)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                <h1 className="text-2xl font-bold">Login</h1>
                <Input
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </form>
        </div>
    )
}