import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { env } from "../env";
import { useAuth } from "../hooks/useAuth";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

function RouteComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const { setToken } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const onSubmit = async (data: LoginData) => {
    try {
      const res = await axios.post(`${env.SERVER_URL}/auth/login`, data);
      const token = res.data.token;

      localStorage.setItem("token", token); // store JWT
      setMessage("Login successful");
      setToken(token);
      navigate({ to: "/" });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || "Login failed");
      } else {
        setMessage("Login failed");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border border-cyan-400 rounded-lg bg-black text-green-400 shadow-xl font-mono">
      <h1 className="text-3xl font-bold text-center mb-6 text-pink-500">
        🔐 Cyber Login
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">📧 Email</label>
          <input
            {...register("email")}
            className="w-full p-2 rounded bg-black border border-green-500 text-green-300"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-pink-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">🔑 Password</label>
          <input
            type="password"
            {...register("password")}
            className="w-full p-2 rounded bg-black border border-green-500 text-green-300"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-pink-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold rounded hover:from-pink-600 hover:to-cyan-600 transition">
          ⚡ Login
        </button>
      </form>

      {message && <p className="mt-4 text-center text-yellow-400">{message}</p>}
    </div>
  );
}
