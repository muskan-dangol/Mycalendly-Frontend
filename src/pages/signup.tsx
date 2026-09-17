import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "../app/services/authApi";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";

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

export const Signup = () => {
  const navigate = useNavigate();

  const [signup] = useRegisterMutation();
  useAuth();

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

  return (
    <div className="w-2/3 md:w-1/2 p-2 lg:p-8 bg-gray-800 rounded-lg shadow-md items-center justify-center">
      <h1 className="text-green-600 text-sm sm:text-md md:text-lg lg:text-xl">
        Welcome to MyCalendly
      </h1>
      <h3 className="text-white text-lg mb-4">Enter your signup credentials</h3>
      <form onSubmit={handleSubmit(onSignUp)} noValidate>
        <div className="w-full flex justify-between gap-6">
          {/* firstName */}
          <div className="w-full">
            <label
              htmlFor="firstName"
              className="block mt-4 mb-2 text-left text-white font-bold"
            >
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter your First Name"
              className="block w-full mb-2 px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-green-400"
              required
              {...register("firstName")}
            ></input>
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>

          {/* lastname */}
          <div className="w-full">
            <label
              htmlFor="lastName"
              className="block mt-4 mb-2 text-left text-white font-bold"
            >
              Last Name:
            </label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter your Last Name"
              className="block w-full mb-2 px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-green-400"
              required
              {...register("lastName")}
            ></input>
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* email */}
        <label
          htmlFor="email"
          className="block mb-2 text-left text-white font-bold"
        >
          Email:
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your Email"
          className="block w-full mb-2 px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-green-400"
          required
          {...register("email")}
        ></input>
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        {/* password */}
        <label
          htmlFor="password"
          className="block mb-2 text-left text-white font-bold"
        >
          Password:
        </label>
        <input
          type={"password"}
          id="password"
          placeholder="Enter your Password"
          className="block w-full mb-2 px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-green-400"
          required
          {...register("password")}
        ></input>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        {/* confirm password */}
        <label
          htmlFor="confirmPassword"
          className="block mb-2 text-left text-white font-bold"
        >
          Confirm Password:
        </label>
        <input
          type={"password"}
          id="confirmPassword"
          placeholder="Enter your Confirm Password"
          className="block w-full mb-6 px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-green-400"
          required
          {...register("confirmPassword")}
        ></input>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}

        <div className="w-full flex justify-center items-center mb-6">
          <Button type="submit" className="w-full" variant="default">
            Submit
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
