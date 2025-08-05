import { ModeToggle } from "@/components/shared/ModeToggle";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { logoutUser } from "@/features/auth/api";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border-b-2">
      <h4 className="font-bold cursor-pointer" onClick={() => navigate("/")}>
        YouTube Clone
      </h4>
      <div className="flex items-center gap-4">
        {user && (
          <Button onClick={() => navigate("/publish-tweet")}>
            Publish Tweet
          </Button>
        )}
        {user && (
          <Button onClick={() => navigate("/publish-video")}>
            Publish Video
          </Button>
        )}
        {user && (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/user">Profile</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}
        {user ? (
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <>
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/register">Register</Link>
            </Button>
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
