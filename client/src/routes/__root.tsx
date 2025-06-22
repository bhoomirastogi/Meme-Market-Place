import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAuth } from "../hooks/useAuth";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Navigation Bar */}
      <header className="bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] shadow-md border-b border-pink-500">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex gap-6 items-center justify-between font-mono text-sm sm:text-base">
          <div className="flex gap-6 items-center">
            <Link
              to="/"
              className="text-pink-400 hover:text-white transition duration-300 [&.active]:text-white [&.active]:font-bold">
              🏠 Home
            </Link>
            <Link
              to="/leaderboard"
              className="text-pink-400 hover:text-white transition duration-300 [&.active]:text-white [&.active]:font-bold">
              🏆 Leaderboard
            </Link>
            {/* <Link
              to="/duals"
              className="text-pink-400 hover:text-white transition duration-300 [&.active]:text-white [&.active]:font-bold"
            >
              ⚔️ Meme Duel
            </Link> */}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-green-300">
                  👋 Hello, <b>{user.username}</b>
                </span>
                <button
                  onClick={logout}
                  className="bg-pink-500 hover:bg-pink-700 text-white px-3 py-1 rounded transition duration-200">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-blue-300 hover:text-white transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-green-400 hover:text-white transition">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="bg-[#0a0a1a] text-white min-h-screen py-6">
        <div className="max-w-full mx-auto border border-pink-500 rounded-xl p-6 shadow-[0_0_20px_#ff00cc33] bg-[#111112]">
          <Outlet />
        </div>
      </main>

      {/* Devtools */}
      <TanStackRouterDevtools />
    </>
  );
}
