"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("loopUser");

    // Replace current history entry
    router.replace("/login");

    // Prevent going back
    setTimeout(() => {
      window.history.pushState(null, "", "/login");
    }, 0);
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left rounded-2xl px-4 py-3 text-sm text-gray-400 transition hover:bg-red-500/10 hover:text-red-300"
    >
      Logout
    </button>
  );
}