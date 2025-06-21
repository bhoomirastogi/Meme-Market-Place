import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      {/* Navigation Bar */}
      <header className="bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] shadow-md border-b border-pink-500">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex gap-6 items-center justify-start font-mono text-sm sm:text-base">
          <Link
            to="/"
            className="text-pink-400 hover:text-white transition duration-300 [&.active]:text-white [&.active]:font-bold"
          >
            🏠 Home
          </Link>
          <Link
            to="/leaderboard"
            className="text-pink-400 hover:text-white transition duration-300 [&.active]:text-white [&.active]:font-bold"
          >
            🏆 Leaderboard
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="bg-[#0a0a1a] text-white min-h-screen py-6 px-4">
        <div className="max-w-5xl mx-auto border border-pink-500 rounded-xl p-6 shadow-[0_0_20px_#ff00cc33] bg-[#111112]">
          <Outlet />
        </div>
      </main>

      {/* Devtools */}
      <TanStackRouterDevtools />
    </>
  ),
});
