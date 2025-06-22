import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { env } from "../env";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(2, "Username must be at least 2 characters"),
});

type RegisterData = z.infer<typeof registerSchema>;

function RouteComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const [message, setMessage] = useState("");

  const onSubmit = async (data: RegisterData) => {
    try {
      const res = await axios.post(`${env.SERVER_URL}/auth/register`, data);
      setMessage(res.data.message || "Registered successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage("Email Already Register"); // show actual error message
      } else {
        setMessage("Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-mono relative overflow-hidden">
      {/* Glowing animated lines */}
      <div className="absolute w-full h-full overflow-hidden z-0">
        <div className="animate-pulse absolute top-1/4 left-0 w-full h-px bg-pink-500 opacity-30"></div>
        <div className="animate-pulse absolute top-1/2 left-0 w-full h-px bg-cyan-500 opacity-30"></div>
        <div className="animate-pulse absolute top-3/4 left-0 w-full h-px bg-purple-500 opacity-30"></div>
      </div>

      <div className="relative z-10 bg-white/5 border border-pink-500 backdrop-blur-md rounded-xl p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold text-pink-400 mb-6 text-center">
          🔮 Register Now
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-cyan-300">Username</label>
            <input
              {...register("username")}
              className="w-full bg-black/30 text-white border border-cyan-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="e.g. cyberwolf"
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm text-cyan-300">Email</label>
            <input
              {...register("email")}
              className="w-full bg-black/30 text-white border border-cyan-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="e.g. wolf@cybermail.com"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm text-cyan-300">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full bg-black/30 text-white border border-cyan-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="********"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 transition-colors duration-300 text-black font-bold py-2 rounded shadow-md shadow-pink-500/30 hover:shadow-pink-500/60">
            🚀 Register
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-green-300">{message}</p>
        )}
      </div>
    </div>
  );
}
