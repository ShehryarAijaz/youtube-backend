import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { ModeToggle } from "@/components/shared/ModeToggle";

export default function AppRouter() {
    return (
        <ThemeProvider>
        <ModeToggle />
        <BrowserRouter>
            <Routes>
                {/* <Route path="/" element={<Home />} /> */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
        </ThemeProvider>
    )
}