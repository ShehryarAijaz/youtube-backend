import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const UserPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex justify-center flex-col items-center min-h-screen p-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Profile</CardTitle>
        </CardHeader>
        <div className="flex justify-center items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <CardContent>
          <div className="flex flex-col gap-2 text-center">
            <p>{user?.fullName}</p>
            <p>{user?.email}</p>
            <p>{user?.createdAt.split("T")[0]}</p>
          </div>
        </CardContent>
      </Card>
      <Button className="mt-4">
        <Link to="/update-account">Update Account</Link>
      </Button>
    </div>
  );
};

export default UserPage;