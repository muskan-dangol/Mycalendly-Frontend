import { useDispatch } from "react-redux";
import { Button } from "../components/ui/button";
import { logout } from "../features/user/authSlice";

export const HomePage = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="!text-5xl !font-bold">When can we meet next?</h1>
      <Button
        type="button"
        variant="hero"
        className="mt-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
      >
        Check my calendar
      </Button>
      <Button
        type="button"
        variant="hero"
        className="mt-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
};
