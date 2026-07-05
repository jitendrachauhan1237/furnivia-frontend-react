import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import useScrollToTop from "../hooks/useScrollToTop";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "../Firebase/firebase.config";

const LoginSignup = () => {
  useScrollToTop();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setError("");
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin && password !== confirmPass) {
      return setError("Passwords do not match");
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      resetForm();
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to authenticate");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-neutral-100 to-yellow-50 px-4">
      <div className="relative flex min-h-[560px] w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-xl">
        <div className="hidden w-1/2 bg-[#2f241f] p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.4em] text-orange-200">Welcome</p>
            <h2 className="text-4xl font-bold leading-tight">
              A polished furniture storefront, ready for you.
            </h2>
            <p className="mt-6 text-sm text-orange-50/80">
              Sign in or create an account to preview your cart, checkout, profile, and orders seamlessly synced with Firebase.
            </p>
          </div>
          <div className="rounded-3xl bg-white/10 p-6">
            <p className="text-sm text-orange-100">Secure Authentication</p>
            <p className="mt-2 font-semibold">Powered by Firebase</p>
          </div>
        </div>

        <div className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-10">
          <AnimatePresence mode="wait">
            <h2
              key={isLogin ? "login-heading" : "signup-heading"}
              className="mb-6 text-center text-2xl font-bold text-gray-800"
            >
              {isLogin ? "Welcome Back" : "Create an Account"}
            </h2>
          </AnimatePresence>

          <div className="mb-8 flex rounded-full bg-gray-100 p-1">
            <button
              className={`w-1/2 rounded-full py-2 font-medium transition-all duration-300 ${
                isLogin ? "bg-amber-600 text-white" : "text-gray-500"
              }`}
              onClick={() => {
                setIsLogin(true);
                resetForm();
              }}
            >
              Login
            </button>
            <button
              className={`w-1/2 rounded-full py-2 font-medium transition-all duration-300 ${
                !isLogin ? "bg-amber-600 text-white" : "text-gray-500"
              }`}
              onClick={() => {
                setIsLogin(false);
                resetForm();
              }}
            >
              Signup
            </button>
          </div>

          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <form
                key={isLogin ? "login" : "signup"}
                className="absolute w-full space-y-4"
                onSubmit={handleEmailAuth}
              >
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {!isLogin && (
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                  />
                )}
                {error && <div className="text-center text-sm text-red-500">{error}</div>}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-amber-600 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                  {isLogin ? "Login" : "Create Account"}
                </button>
                <div className="my-2 flex items-center justify-center">
                  <span className="text-sm text-gray-500">or</span>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 py-4 transition hover:bg-gray-50"
                >
                  <FcGoogle size={24} />
                  <span className="text-sm font-medium text-gray-700">
                    Continue with Google
                  </span>
                </button>
              </form>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
