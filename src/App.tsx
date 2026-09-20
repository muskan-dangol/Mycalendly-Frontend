import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./pages/login";
import { Signup } from "./pages/signup";
import { HomePage } from "./pages/home";
import { EmailConfirmation } from "./pages/emailConfirmation";
import { EmailVerification } from "./pages/emailVerification";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ResetPassword } from "./pages/resetPassword";
import { PasswordResetRequest } from "./pages/passwordResetRequest";

const router = createBrowserRouter([
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/", element: <ProtectedRoute><HomePage /></ProtectedRoute> },
  { path: "/email-confirmation", element: <EmailConfirmation /> },
  { path: "/verify-email", element: <EmailVerification /> },
  { path: "/reset-password-request", element: <PasswordResetRequest /> },
  { path: "/reset-password", element: <ResetPassword /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
