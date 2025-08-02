import { useState, useRef } from "react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { registerUser } from "@/features/auth/api";
import { Camera } from "lucide-react";

export default function RegisterPage() {
    const setUser = useAuthStore((state) => state.setUser)
    const navigate = useNavigate()
    const [loading, setLoading] = useState()
    const [error, setError] = useState(null)
    const [avatar, setAvatar] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const fileInputRef = useRef(null)

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        fullName: "",
        password: "",
        avatar: null
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData({ ...formData, avatar: file })
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        // Validate required fields
        if (!formData.username || !formData.email || !formData.fullName || !formData.password) {
            setError("All fields are required")
            setLoading(false)
            return
        }

        if (!formData.avatar) {
            setError("Avatar is required")
            setLoading(false)
            return
        }

        const data = new FormData();
        data.append("username", formData.username)
        data.append("email", formData.email)
        data.append("fullName", formData.fullName)
        data.append("password", formData.password)
        data.append("avatar", formData.avatar)

        try {
            const response = await registerUser(data)
            if (response.success) {
                setUser(response.data)
                navigate("/")
            }
        } catch (error) {
            setError(error.message || "Registration failed")
            console.error(error)
        } finally {
            setLoading(false)
        }

    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    // NEED TO FIX SOME FUNCTIONALITY

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>
                        Enter your details to register
                    </CardDescription>
                    <CardAction>
                        <Button variant="link" asChild>
                            <Link to="/login">Sign In</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                        className="w-full max-w-md space-y-4">
                        <div className="flex items-center justify-center gap-4">
                            <label htmlFor="avatar-upload" className="cursor-pointer relative" onClick={triggerFileInput}>
                                <Avatar className={`w-16 h-16 border ${!formData.avatar ? 'border-red-500' : 'border-muted'}`}>
                                    <AvatarImage
                                        src={avatarPreview}
                                        alt="User Avatar"
                                        className="object-cover"
                                    />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                                <div>
                                    <input
                                        id="avatar-upload"
                                        name="avatar"
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                        required
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-white rounded-full transition-opacity">
                                        <Camera className="w-5 h-5" />
                                    </div>
                                </div>
                            </label>
                            {!formData.avatar && (
                                <span className="text-sm text-red-500">Avatar is required</span>
                            )}
                        </div>

                        <Input
                            name="username"
                            type="text"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <Input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <Input
                            name="fullName"
                            type="text"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                        <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <Button type="submit" disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}