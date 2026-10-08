import { useEffect } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { isTokenValid } from "../lib/utils";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCredentials, logout } from "../features/user/authSlice";
import { useLoginMutation } from "../app/services/authApi";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading, isError, error }] = useLoginMutation();
  const { isAuthenticated } = useAuth();

  const loginErrorMessage = (() => {
    if (!isError || !error) {
      return "An error occurred";
    }

    const apiError = error as FetchBaseQueryError & { data?: unknown };

    if (typeof apiError.data === "string") {
      return apiError.data;
    }

    if (
      apiError.data &&
      typeof apiError.data === "object" &&
      "message" in apiError.data &&
      typeof apiError.data.message === "string"
    ) {
      return apiError.data.message;
    }

    return "An error occurred";
  })();

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
    const token = localStorage.getItem("userToken");

    if (!isAuthenticated && token && !isTokenValid(token)) {
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, dispatch, navigate]);

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
      <p className="text-white text-lg">Enter your login credentials</p>

      {isError && (
        <h3 className="text-red-500 text-sm mt-2">{loginErrorMessage}</h3>
      )}

      <form onSubmit={handleSubmit(onLogin)} noValidate>
        {/* email field */}
        <Label htmlFor="email" className="mt-4">
          Email:
        </Label>
        <Input
          type="email"
          id="email"
          icon={<Mail className="w-5 h-5" />}
          wrapperClassName="mb-2"
          placeholder="example@gmail.com"
          required
          {...register("email")}
        />

        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        {/* password */}
        <Label htmlFor="password" className="mt-4">
          Password:
        </Label>

        <div className="relative mb-2">
          <Input
            type="password"
            id="password"
            icon={<Lock className="w-5 h-5 font-sm" />}
            wrapperClassName="mb-2"
            placeholder="........."
            required
            {...register("password")}
          />

          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <Link
          to="/reset-password-request"
          className="block w-fit ml-auto text-xs text-blue-500 hover:underline font-medium mt-1"
        >
          Forgot password?
        </Link>

        <div className="w-full flex justify-center items-center mt-6 mb-6">
          <Button type="submit" className="w-full" variant="default">
            {isLoading ? "Logging in..." : "Login"}
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

const loginSchema = z.object({
  email: z.string().email({ message: "Email is invalid" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;
