import { useNavigate, Link } from "react-router-dom";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { Lock, Mail, User } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "../app/services/authApi";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export const Signup = () => {
  const navigate = useNavigate();

  const [signup, { isLoading, isError, error }] = useRegisterMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
    },
  });

  const onSignUp = async (data: SignupFormData) => {
    try {
      await signup(data).unwrap();

      navigate("/email-confirmation");
    } catch (err: unknown) {
      console.error("Signup failed", err);
    }
  };

  const signupErrorMessage = (() => {
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

  return (
    <div className="w-2/3 md:w-1/2 p-2 lg:p-8 bg-gray-800 rounded-lg shadow-md items-center justify-center">
      <h1 className="text-green-600 text-sm sm:text-md md:text-lg lg:text-xl">
        Welcome to MyCalendly
      </h1>
      <p className="text-white text-lg mb-4">Enter your signup credentials</p>

      {isError && (
        <h3 className="text-red-500 text-sm mt-2">{signupErrorMessage}</h3>
      )}

      <form onSubmit={handleSubmit(onSignUp)} noValidate>
        <div className="w-full flex justify-between gap-6">
          {/* firstName */}
          <div className="w-full">
            <Label
              htmlFor="firstName"
              className="block mt-4 mb-2 text-left text-white font-bold"
            >
              First Name:
            </Label>
            <Input
              type="text"
              id="firstName"
              icon={<User className="w-5 h-5" />}
              placeholder="First name"
              required
              {...register("firstName")}
            />

            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          {/* lastname */}
          <div className="w-full">
            <Label
              htmlFor="lastName"
              className="block mt-4 mb-2 text-left text-white font-bold"
            >
              Last Name:
            </Label>
            <Input
              type="text"
              id="lastName"
              placeholder="Last name"
              required
              {...register("lastName")}
            />

            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* email */}
        <Label
          htmlFor="email"
          className="block mt-4 mb-2 text-left text-white font-bold"
        >
          Email:
        </Label>
        <Input
          type="email"
          id="email"
          icon={<Mail className="w-5 h-5" />}
          placeholder="example@gmail.com"
          required
          {...register("email")}
        />

        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        {/* password */}
        <Label
          htmlFor="password"
          className="block mt-4 mb-2 text-left text-white font-bold"
        >
          Password:
        </Label>
        <Input
          type={"password"}
          id="password"
          icon={<Lock className="w-5 h-5" />}
          placeholder="........."
          required
          {...register("password")}
        />

        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        {/* confirm password */}
        <Label
          htmlFor="confirmPassword"
          className="block mt-4 mb-2 text-left text-white font-bold"
        >
          Confirm Password:
        </Label>
        <Input
          type={"password"}
          id="confirmPassword"
          icon={<Lock className="w-5 h-5" />}
          placeholder="Enter your Confirm Password"
          wrapperClassName=" mb-6 py-1"
          required
          {...register("confirmPassword")}
        />

        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}

        <div className="w-full flex justify-center items-center mb-6">
          <Button type="submit" className="w-full" variant="default">
            {isLoading ? "Signing up..." : "Sign up"}
          </Button>
        </div>
      </form>

      <p className="mt-4">
        <>Already have an account? </>
        <Link
          to="/login"
          className="text-blue-500 
            hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;

const SignupSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    firstName: z
      .string()
      .min(2, { message: "FirstName must be at least 2 characters" }),
    lastName: z
      .string()
      .min(2, { message: "LastName must be at least 2 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password must be equal to Password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof SignupSchema>;
