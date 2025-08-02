import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/features/auth/LoginPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* <Route path="/" element={<Home />} /> */}
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    )
}