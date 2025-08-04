import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateAccountDetails, updatePassword } from "./api";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

const UpdateAccount = () => {
  const [accountFormData, setAccountFormData] = useState({
    fullName: "",
    email: "",
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: ""
  });
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-hide success alert after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleAccountChange = (e) => {
    setAccountFormData({ ...accountFormData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordFormData({ ...passwordFormData, [e.target.name]: e.target.value })
  }

  const handleAccountDetailsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await updateAccountDetails(accountFormData);
      if (response?.status === 200) {
        setAccountFormData({
            fullName: response.data.fullName,
            email: response.data.email
        })
        setSuccess(true);
        setSuccessMessage(response.message || "Account details updated successfully");
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await updatePassword(passwordFormData);
      if (response?.status === 200) {
        setPasswordFormData({
            currentPassword: "",
            newPassword: ""
        })
        setSuccess(true);
        setSuccessMessage(response.message || "Password changed successfully");
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <Tabs defaultValue="account">
            <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Update Account</CardTitle>
                    <CardDescription>
                        Enter your details to update your account
                    </CardDescription>
                    <CardAction>
                    </CardAction>
                </CardHeader>
                <CardContent>
            <form onSubmit={handleAccountDetailsSubmit} className="w-full max-w-md space-y-4">
                <Input
                    name="fullName"
                    placeholder="Full Name"
                    value={accountFormData.fullName}
                    onChange={handleAccountChange}
                    required
                />
                <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={accountFormData.email}
                    onChange={handleAccountChange}
                    required
                />
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update"}
                </Button>
            </form>
            </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="password">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Update Password</CardTitle>
                    <CardDescription>
                        Enter your details to update your password
                    </CardDescription>
                    <CardAction>
                    </CardAction>
                </CardHeader>
                <CardContent>
            <form onSubmit={handlePasswordSubmit} className="w-full max-w-md space-y-4">
                <Input
                    name="currentPassword"
                    type="password"
                    placeholder="Current Password"
                    value={passwordFormData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                />
                <Input
                    name="newPassword"
                    type="password"
                    placeholder="New Password"
                    value={passwordFormData.newPassword}
                    onChange={handlePasswordChange}
                    required
                />
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update"}
                </Button>
            </form>
            </CardContent>
            </Card>
            </TabsContent>
            </Tabs>
            {success && (
                <Alert className="mt-4">
                    <CheckCircle2Icon />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                        {successMessage}
                    </AlertDescription>
                </Alert>
            )}
        </div>
  );
};

export default UpdateAccount;
