import { useState } from "react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser } from "./api";
import { useAuthStore } from "@/store/auth";
import { Link, useNavigate } from "react-router-dom";

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
            const response = await loginUser(formData)
            if (response && response.user) {
                setUser(response.user)
                localStorage.setItem("user", JSON.stringify(response.user))
                try {
                    navigate("/")
                } catch (error) {
                    console.error("Error during navigate:", error)
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Enter your details to login
                    </CardDescription>
                    <CardAction>
                        <Button variant="link" asChild>
                            <Link to="/register">Register</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
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
            </CardContent>
            </Card>
        </div>
    )
}