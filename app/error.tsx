"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">

      <div className="max-w-xl text-center">

        <h1 className="text-7xl font-bold text-red-500">
          Error
        </h1>

        <h2 className="mt-6 text-3xl font-semibold text-white">
          Something went wrong
        </h2>

        <p className="mt-4 leading-7 text-gray-400">
          An unexpected error occurred while processing your request.
          Please try again.
        </p>

        <div className="mt-10 flex justify-center gap-4">

          <button
            onClick={reset}
            className="
              rounded-xl
              bg-blue-600
              px-6
              py-3
              font-medium
              text-white
              transition
              hover:bg-blue-700
            "
          >
            Try Again
          </button>

          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-6
              py-3
              font-medium
              text-gray-300
              transition
              hover:bg-white/10
            "
          >
            Dashboard
          </button>

        </div>

      </div>

    </main>
  );
}