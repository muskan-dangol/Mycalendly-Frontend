import { type CredentialResponse } from "@react-oauth/google";
import { googleAuth } from "../app/services/authApi";
import { setCredentials } from "../features/user/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { delay } from "./utils";
import { toast } from "../hooks/useToast";

// Handler functions defined before hooks so they can capture correct state

export const handleGoogleSuccess = async (
  credentialResponse: CredentialResponse,
) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!credentialResponse.credential || !credentialResponse.clientId) {
    toast({
      title: "Google login failed",
      description: "No credential received from Google",
      variant: "destructive",
    });

    return;
  }
  try {
    const authResponse = await googleAuth({
      idToken: credentialResponse.credential,
      clientId: credentialResponse.clientId,
    }).unwrap();

    // Store user data in auth context
    const authData = authResponse.data;
    if (!authData?.user || !authData?.token) {
      throw new Error("Google login response did not include auth credentials");
    }

    dispatch(setCredentials({ user: authData.user, token: authData.token }));

    await delay(import.meta.env.POST_LOGIN_REDIRECT_DELAY_MS);
    navigate("/", { replace: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to login with Google. Please try again.";
    toast({
      title: "Google login failed",
      description: errorMessage,
      variant: "destructive",
    });
  }
};

export const handleGoogleError = () => {
  toast({
    title: "Google login failed",
    description: "Failed to authenticate with Google",
    variant: "destructive",
  });
};
