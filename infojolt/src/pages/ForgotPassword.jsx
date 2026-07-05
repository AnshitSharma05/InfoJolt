import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import auth from "../assets/auth.jpg"
import { API_BASE_URL } from "@/config/api";

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [input, setInput] = useState({
    email: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/user/reset-password`, input, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/login')
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Password reset failed";
      console.log("Reset password error:", error);
      toast.error(message);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex items-center h-screen md:pt-14 md:h-[760px] ">
      <div className="hidden md:block">
        <img src={auth} alt="" className='h-[700px]' />
      </div>
      <div className='flex justify-center items-center flex-1 px-4 md:px-0'>
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">Reset Password</CardTitle>
          <p className='text-gray-600 dark:text-gray-300 mt-2 text-sm font-serif text-center'>Enter your email and new password</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label>Email</Label>
              <Input type="email"
                placeholder="Email Address"
                name="email"
                value={input.email}
                onChange={handleChange}
                className="dark:border-gray-600 dark:bg-gray-900"
              />
            </div>

            <div className="relative">
              <Label>New Password</Label>
              <Input type={showPassword ? "text" : "password"}
                placeholder="Enter New Password"
                name="newPassword"
                value={input.newPassword}
                onChange={handleChange}
                className="dark:border-gray-600 dark:bg-gray-900"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button type="submit" className="w-full">Reset Password</Button>
            <p className='text-center text-gray-600 dark:text-gray-300'>Remember your password? <Link to={'/login'}><span className='underline cursor-pointer hover:text-gray-800'>Login</span></Link></p>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

export default ForgotPassword