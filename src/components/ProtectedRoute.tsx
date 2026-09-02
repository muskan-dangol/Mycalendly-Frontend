import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";

type Props = {
  children: ReactNode;
  redirectTo?: string;
};

export const ProtectedRoute = ({ children, redirectTo = "/login" }: Props) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
