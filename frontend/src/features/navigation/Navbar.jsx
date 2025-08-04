import { ModeToggle } from "@/components/shared/ModeToggle";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    NavigationMenuIndicator,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import api from "@/services/api"
import { useAuthStore } from "@/store/auth"

const Navbar = () => {

    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const logoutUser = async () => {
        await api.post("/users/logout")
        logout()
        localStorage.removeItem("user")
        navigate("/login")
    }

    return (
        <div className="flex justify-between items-center p-4 border-b-2">
            <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>YouTube Clone</h1>
            <div className="flex items-center gap-4">
                {user && <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link to="/user">Profile</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>}
                {user ?
                <Button variant="outline" onClick={logoutUser}>Logout</Button>
                : <><Button variant="outline" asChild><Link to="/login">Login</Link></Button> 
                <Button variant="outline" asChild><Link to="/register">Register</Link></Button></>}
                <ModeToggle />
            </div>
        </div>
    )
}

export default Navbar;