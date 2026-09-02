import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/authSlice";

export const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = !!user;

  return useMemo(() => ({ user, isAuthenticated }), [user, isAuthenticated]);
};
