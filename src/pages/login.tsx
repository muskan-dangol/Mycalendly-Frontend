// import { useState } from "react";
import { useEffect } from "react";
import { isTokenValid } from "../lib/utils";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCredentials, logout } from "../features/user/authSlice";
import { useLoginMutation } from "../app/services/authApi";
import { Button } from "../components/ui/button";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email({ message: "Email is invalid" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login] = useLoginMutation();
  const { isAuthenticated } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onLogin = async (data: LoginFormData) => {
    try {
      const res = await login(data).unwrap();
      const authData = res.data;
      if (!authData?.user || !authData.token) {
        throw new Error("Login response did not include auth credentials");
      }
      dispatch(setCredentials({ user: authData.user, token: authData.token }));

      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err?.message || "Login failed");
      }
    }
  };

  // Clear any stale auth data if token is invalid
  useEffect(() => {
    const token = localStorage.getItem("userToken"); // match authSlice
    if (!isAuthenticated && token && !isTokenValid(token)) {
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, dispatch, navigate]);

  // Redirect if already logged in with valid token
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Don't render form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="w-2/3 md:w-1/2 p-2 lg:p-8 bg-gray-800 rounded-lg shadow-md items-center justify-center ">
      <h1 className="text-green-600 text-sm sm:text-md md:text-lg lg:text-xl mb-4">
        Welcome to MyCalendly
      </h1>
      <h3 className="text-white text-lg">Enter your login credentials</h3>
      <form onSubmit={handleSubmit(onLogin)} noValidate>
        {/* email */}
        <label
          htmlFor="email"
          className="block mt-4 mb-2 text-left text-white font-bold"
        >
          Email:
        </label>
        <div className="relative mb-2">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            id="email"
            placeholder="Enter your Email"
            className="block w-full pl-10 pr-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-green-400"
            required
            {...register("email")}
          />
        </div>

        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <label
          htmlFor="password"
          className="block mb-2 text-left text-white font-bold"
        >
          Password:
        </label>

        <div className="relative mb-2">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="password"
            id="password"
            placeholder="Enter your Password"
            className="block w-full pl-10 pr-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-green-400"
            required
            {...register("password")}
          />
        </div>

        {/* password */}
        <Link
          to="/reset-password-request"
          className="text-xs text-primary hover:underline font-medium flex justify-end"
        >
          Forgot password?
        </Link>

        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
        <div className="w-full flex justify-center items-center mt-6 mb-6">
          <Button type="submit" className="w-full" variant="default">
            Submit
          </Button>
        </div>
      </form>

      {/* Toggle */}
      <p className="text-center text-sm text-muted-foreground">
        <>Don't have an account? </>
        <Link
          to="/signup"
          className="text-blue-500 
            hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
