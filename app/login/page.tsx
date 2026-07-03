"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  useEffect(() => {
  // Prevent going back from the login page
  window.history.pushState(null, "", window.location.href);

  const handleBackButton = () => {
    window.history.pushState(null, "", window.location.href);
  };

  window.addEventListener("popstate", handleBackButton);

  return () => {
    window.removeEventListener("popstate", handleBackButton);
  };
}, []);

  const [isSignup, setIsSignup] = useState(false);

const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

async function handleSubmit(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault();

  setLoading(true);
  setError("");

  try {
    if (isSignup) {
      // SIGN UP
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to create your account. Please try again."
        );
        return;
      }

      // Save username locally
      localStorage.setItem("loopUser", username);

      // Redirect to home page
      router.replace("/");
    } else {
      // SIGN IN
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok && !result.error) {
        localStorage.setItem(
          "loopUser",
          email.split("@")[0] || "User"
        );

        router.replace("/");
      } else {
        setError(
          "Invalid email or password. Please check your credentials and try again."
        );
      }
    }
  } catch (error) {
    console.error(error);

    setError(
      "Something went wrong. Please try again later."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <section className="hidden lg:flex flex-col justify-center px-20">

          <Link
            href="/"
            className="mb-10 text-2xl font-bold text-blue-500"
          >
            Project LOOP
          </Link>

          <h1 className="text-6xl font-bold leading-tight">
            AI Customer
            <br />
            Feedback
            <br />
            Intelligence
          </h1>

          <p className="mt-8 max-w-xl text-lg text-gray-400 leading-8">
            Transform raw customer feedback into meaningful
            insights using sentiment analysis, theme detection,
            and real-time analytics.
          </p>

        </section>

        {/* RIGHT SIDE */}
        <section className="flex items-center justify-center p-8">

          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

            {/* TOGGLE */}
            <div className="mb-8 flex rounded-2xl bg-black/20 p-1">

              <button
                onClick={() => setIsSignup(false)}
                className={`flex-1 rounded-xl py-3 transition ${
                  !isSignup
                    ? "bg-blue-600"
                    : "text-gray-400"
                }`}
              >
                Sign In
              </button>

              <button
                onClick={() => setIsSignup(true)}
                className={`flex-1 rounded-xl py-3 transition ${
                  isSignup
                    ? "bg-blue-600"
                    : "text-gray-400"
                }`}
              >
                Sign Up
              </button>

            </div>

            <h2 className="text-3xl font-bold">
  {isSignup ? "Create Account" : "Welcome Back"}
</h2>

<p className="mt-2 text-gray-400">
  {isSignup
    ? "Create your Project LOOP account."
    : "Sign in to continue."}
</p>

{error && (
  <div
    className="
      mt-4
      rounded-2xl
      border border-red-500/30
      bg-red-500/10
      px-4 py-3
      text-sm text-red-300
    "
  >
    {error}
  </div>
)}

<form
  onSubmit={handleSubmit}
  className="mt-8 space-y-6"
  autoComplete="off"
>

              {isSignup && (
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Username
                  </label>

                  <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    placeholder="Enter your username"
                    className="
                      w-full
                      rounded-2xl
                      border border-white/10
                      bg-black/20
                      px-4
                      py-4
                      outline-none
                      focus:border-blue-500
                    "
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Email
                </label>

                <input
  type="email"
  autoComplete="off"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter your email"
  className="
    w-full
    rounded-2xl
    border border-white/10
    bg-black/20
    px-4
    py-4
    outline-none
    focus:border-blue-500
  "
/>
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Password
                </label>

                <input
  type="password"
  autoComplete="new-password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter your password"
  className="
    w-full
    rounded-2xl
    border border-white/10
    bg-black/20
    px-4
    py-4
    outline-none
    focus:border-blue-500
  "
/>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  rounded-2xl
                  bg-blue-600
                  py-4
                  font-medium
                  transition
                  hover:bg-blue-500
                  disabled:opacity-50
                "
              >
                {loading
                  ? "Processing..."
                  : isSignup
                  ? "Create Account"
                  : "Sign In"}
              </button>

            </form>

          </div>

        </section>

      </div>

    </main>
  );
} 