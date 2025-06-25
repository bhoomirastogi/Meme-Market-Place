import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAuth } from "../hooks/useAuth";
import { CreateMemeForm } from "../components/CreateMemeForm";
import { useState } from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { user, logout } = useAuth();
  const [showForm, setShowForm] = useState(false);
  return (
    <>
      {/* Navbar */}
      <header className="bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] shadow-md border-b border-pink-500">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left Navigation Links */}
          <div className="flex items-center gap-6 text-sm sm:text-base font-mono">
            <Link
              to="/"
              className="text-pink-400 hover:text-white transition-all [&.active]:text-white [&.active]:font-bold"
            >
              🏠 Home
            </Link>
            <Link
              to="/leaderboard"
              className="text-pink-400 hover:text-white transition-all [&.active]:text-white [&.active]:font-bold"
            >
              🏆 Leaderboard
            </Link>
          </div>

          {/* Right Side Auth */}
          <div className="flex items-center gap-4 text-sm sm:text-base">
            {user ? (
              <>
                <div className="text-green-300 font-mono">
                  👋 <b>{user.username}</b> | 💰 <b>{user.credits}</b>
                </div>
                <button
                  onClick={logout}
                  className="bg-pink-500 hover:bg-pink-700 text-white px-4 py-1.5 rounded-md transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-blue-300 hover:text-white transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-green-400 hover:text-white transition font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="bg-[#0a0a1a] text-white min-h-screen py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold neon-glow">
            ⚡ MemeHustle Market
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-pink-600 hover:bg-pink-500 transition px-4 py-2 rounded shadow neon-border"
          >
            ➕ Create Meme
          </button>
        </div>

        {showForm && <CreateMemeForm onClose={() => setShowForm(false)} />}
        <div className="max-w-6xl mx-auto border border-pink-500 rounded-2xl p-6 sm:p-10 shadow-[0_0_25px_#ff00cc33] bg-[#111112]">
          <Outlet />
        </div>
      </main>

      {/* Devtools */}
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
