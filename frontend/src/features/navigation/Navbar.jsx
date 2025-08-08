import { ModeToggle } from "@/components/shared/ModeToggle";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // keep API call if needed, otherwise local logout
      logout();
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const userInitials = (user?.fullName || user?.username || "U")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 dark:bg-gray-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-gray-900/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-14 flex items-center justify-between gap-4">
          {/* Left: Brand */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 focus:outline-none"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-red-600 text-white">
                {/* play triangle icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </span>
              <span className="text-lg font-semibold tracking-tight">YouTube Clone</span>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="outline" onClick={() => navigate("/publish-video")}>Publish Video</Button>
                <Button variant="outline" onClick={() => navigate("/publish-tweet")}>Publish Tweet</Button>

                {/* User dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full focus:outline-none">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.username} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user?.fullName || user?.username || "User"}</span>
                        <span className="text-xs text-gray-500">{user?.email || ""}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/user")}>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/publish-video")}>Publish Video</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/publish-tweet")}>Publish Tweet</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
