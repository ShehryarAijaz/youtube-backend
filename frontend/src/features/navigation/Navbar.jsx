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
import { Link } from "react-router-dom"

const Navbar = () => {

    const user = localStorage.getItem("user")

    return (
        <div className="flex justify-between items-center p-4 border-b-2">
            <h1 className="text-2xl font-bold">YouTube Clone</h1>
            <div className="flex items-center gap-4">
                <ModeToggle />
                {user ?
                <Button variant="outline" onClick={() => {
                    localStorage.removeItem("user")
                    window.location.reload()
                }}>Logout</Button>
                : <><Button variant="outline" asChild><Link to="/login">Login</Link></Button> 
                <Button variant="outline" asChild><Link to="/register">Register</Link></Button></>}
            </div>
        </div>
    )
}

export default Navbar;