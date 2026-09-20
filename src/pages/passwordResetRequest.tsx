import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useRequestPasswordResetMutation } from "../app/services/passwordApi";

const PasswordResetFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ProvideRegisteredEmailFormData = z.infer<typeof PasswordResetFormSchema>;

// Component for recovering user identity by providing a registered email.
export const PasswordResetRequest = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ProvideRegisteredEmailFormData>({
    resolver: zodResolver(PasswordResetFormSchema),
    defaultValues: { email: "" },
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestPasswordReset, { isLoading }] =
    useRequestPasswordResetMutation();
  const navigate = useNavigate();

  const handleProvideRegisteredEmail = async (
    data: ProvideRegisteredEmailFormData,
  ) => {
    await requestPasswordReset(data).unwrap();

    setIsSubmitted(true);
  };

  const resetForm = useForm<ProvideRegisteredEmailFormData>({
    resolver: zodResolver(PasswordResetFormSchema),
    defaultValues: { email: "" },
  });

  if (isSubmitted) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-md text-center">
        <h2 className="text-2xl">Email has been sent successfully!</h2>
        <h2>Check your inbox</h2>
        <p className="mb-4 text-white text-sm">
          If an account with the provided email exists, you will receive an
          email with instructions to reset your password.
        </p>
        <div className="pt-4 space-y-3">
          <Button
            onClick={() => navigate("/login")}
            className="w-full gap-2"
            size="lg"
          >
            Back to login
          </Button>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              resetForm.reset();
            }}
            variant="link"
            className="w-full gap-2"
            size="lg"
          >
            Try another email
          </Button>
        </div>

        <p className="text-sm text-muted-foreground pt-4">
          Didn't receive the email?{" "}
          <button
            onClick={() => {
              setIsSubmitted(false);
              resetForm.reset();
            }}
            className="text-blue-500 text-primary font-medium hover:underline"
          >
            Try again
          </button>{" "}
          or{" "}
          <Link
            to="/support"
            className="text-blue-500 text-primary font-medium hover:underline"
          >
            contact support
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-md">
      <h1 className="mb-4 text-2xl font-bold text-white">
        Lets find your account
      </h1>
      <p className="mb-4 text-white text-sm">
        Please provide the email address associated with your account. If the
        account exists, we will send you an email with instructions to reset
        your password.
      </p>
      <form onSubmit={handleSubmit(handleProvideRegisteredEmail)} noValidate>
        <Label
          htmlFor="email"
          className="block mt-4 mb-2 text-left text-white font-bold"
        >
          Email:
        </Label>
        <div className="relative mb-2">
          <Input
            type="email"
            id="registered-email"
            icon={<Mail className="w-full h-5" />}
            wrapperClassName="mb-2"
            placeholder="email address"
            required
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          {isLoading ? "Processing..." : "Continue"}
        </Button>
      </form>

      {/* Footer */}
      <div className="pt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Remember your password?
          <Link
            to="/login"
            className="text-primary font-medium text-blue-500 hover:underline hover:text-blue-600"
          >
            {" "}
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};
