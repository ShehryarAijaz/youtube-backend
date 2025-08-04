import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import HomePage from "@/features/home/HomePage"
import Navbar from "@/features/navigation/Navbar"

export default function AppRouter() {
    return (
        <ThemeProvider>
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
        </ThemeProvider>
    )
}