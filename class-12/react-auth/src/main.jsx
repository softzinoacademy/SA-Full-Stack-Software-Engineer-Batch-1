import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, redirect } from "react-router";
import { RouterProvider } from "react-router/dom";
import Login from "./Components/Login.jsx";
import ForgotPassword from "./Components/ForgetPassword.jsx";
import { supabase } from "./utils/supabase.js";

const checkSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.log("Error checking session:", error);
    return;
  }
  if (data.session) {
    console.log("User is signed in:", data.session);
    return redirect("/");
  }

  if (!data.session) {
    console.log("User is not signed in");
    return redirect("/login");
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    // loader: checkSession,
  },

  // auth routes
  {
    path: "/login",
    Component: Login,
    // loader: checkSession,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />,
  </StrictMode>
);
