import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./pages/login";
import { Signup } from "./pages/signup";
import { HomePage } from "./pages/home";
import { ProtectedRoute } from "./components/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/home", element: <ProtectedRoute><HomePage /></ProtectedRoute> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
