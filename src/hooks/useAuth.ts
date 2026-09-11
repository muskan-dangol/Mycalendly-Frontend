import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "../features/user/authSlice";

export const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const isAuthenticated = !!user || !!token;

  return useMemo(
    () => ({ user, token, isAuthenticated }),
    [user, token, isAuthenticated],
  );
};
