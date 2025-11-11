import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const init = () => {
      /* global google */
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.error("VITE_GOOGLE_CLIENT_ID not found in .env");
        return;
      }

      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        {
          theme: "outline",
          size: "large",
          shape: "pill",
          width: 250,
        }
      );
    };

    if (window.google) init();
    else {
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true;
      s.defer = true;
      s.onload = init;
      document.body.appendChild(s);
    }
  }, []);

  function handleCredentialResponse(response) {
    const decoded = jwtDecode(response.credential);
    localStorage.setItem("user", JSON.stringify(decoded));
    navigate("/", { replace: true });
  }

  function handleManualLogin(e) {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    // ✅ Admin check
    if (email === "admin@gmail.com" && password === "admin") {
      const user = { name: "Admin", email };
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/", { replace: true });
    } else {
      alert("Invalid email or password");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-300 via-blue-400 to-purple-500 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse top-20 left-10"></div>
      <div className="absolute w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse bottom-20 right-10"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/40 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30">
        {/* Title and subtitle updated */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          WellnessHub
        </h1>
        <p className="text-gray-600 mb-6 text-center">Welcome Back !!</p>

        {/* Email + Password */}
        <form
          onSubmit={handleManualLogin}
          className="flex flex-col space-y-4 mb-6"
        >
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 accent-blue-500" />
              Remember me
            </label>
            <p
              onClick={() =>
                alert("Password reset link will be sent to your email (demo).")
              }
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Forgot password?
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 rounded-lg hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center mb-6">
          <div className="border-t border-gray-300 w-1/3"></div>
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <div className="border-t border-gray-300 w-1/3"></div>
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <div id="googleSignInDiv"></div>
        </div>

        <p className="text-sm text-gray-600 text-center mt-6">
          Don’t have an account?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
