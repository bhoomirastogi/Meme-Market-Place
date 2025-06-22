import { io } from "socket.io-client";
import { env } from "../env";
import { createContext } from "react";
import type { AuthContextType } from "../context/AuthContext";

export const socket = io(env.SERVER_URL);
export const AuthContext = createContext<AuthContextType | null>(null);
