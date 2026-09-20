import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/button.tsx";
import { Lock } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "../components/ui/input.tsx";
import { Label } from "../components/ui/label.tsx";
import { useResetPasswordMutation } from "../app/services/passwordApi.ts";

const passwordResetSchema = z
  .object({
    token: z.string().nonempty("Token is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof passwordResetSchema>;

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token") ?? "";

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      token: tokenFromUrl,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();

  const handleChangePassword = async (data: ResetPasswordFormData) => {
    await resetPassword(data).unwrap();

    await navigate("/login");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-md text-center">
      <form onSubmit={handleSubmit(handleChangePassword)} noValidate>
        <input type="hidden" {...register("token")} />

        <h1>Set a new password</h1>

        {/* new password */}
        <Label htmlFor="new-password">New Password:</Label>
        <Input
          type="password"
          id="new-password"
          icon={<Lock className="w-5 h-5" />}
          wrapperClassName="mb-2"
          placeholder="New password"
          required
          {...register("newPassword")}
        />

        {/* confirm new password */}
        <Label htmlFor="confirm-password">Confirm Password:</Label>
        <Input
          type="password"
          id="confirm-password"
          icon={<Lock className="w-5 h-5" />}
          wrapperClassName="mb-2"
          placeholder="Confirm password"
          required
          {...register("confirmPassword")}
        />

        {errors.newPassword && (
          <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
        )}

        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}

        {errors.token && (
          <p className="text-red-500 text-sm">{errors.token.message}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          {isLoading ? "Changing Password..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};
