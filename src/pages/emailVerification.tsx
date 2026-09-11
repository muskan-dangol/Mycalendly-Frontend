import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useVerifyEmailMutation } from "../app/services/emailVerify";
import { Button } from "../components/ui/button";

type VerificationStatus = "verifying" | "success" | "error";

export const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("verifying");

  const [searchParams] = useSearchParams();
  const [verifyEmail] = useVerifyEmailMutation();

  const navigate = useNavigate();
  const token = searchParams.get("token");
  const currentStatus: VerificationStatus = token
    ? verificationStatus
    : "error";

  useEffect(() => {
    if (!token) {
      return;
    }

    const onVerifyingEmail = async () => {
      try {
        await verifyEmail({ token }).unwrap();
        setVerificationStatus("success");
      } catch (error) {
        setVerificationStatus("error");
        console.error("Error verifying email:", error);
      }
    };

    void onVerifyingEmail();
  }, [token, verifyEmail]);

  return (
    // Uncomment the below code if you want to display the verification status in a different way
    <div>
      {currentStatus === "verifying" && (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Verifying Email
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Please wait while we verify your email address...
            </p>
          </div>
        </div>
      )}

      {currentStatus === "success" && (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Email Verified Successfully
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Your email address has been verified. You can now log in to your
              account.
            </p>
          </div>
          <div className="pt-4">
            <Button
              onClick={() => navigate("/login")}
              className="w-full gap-2"
              size="lg"
            >
              Go to Login
            </Button>
          </div>
        </div>
      )}

      {currentStatus === "error" && (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Verification Failed
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Failed to verify email. Please try again.
            </p>
          </div>
          <div className="pt-4 space-y-3">
            <Button
              onClick={() => navigate("/login")}
              className="w-full gap-2"
              size="lg"
            >
              Go to Login
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
              size="lg"
            >
              Go to Home
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
