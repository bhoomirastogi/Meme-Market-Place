// src/context/AuthContext.tsx
import axios from "axios";
import { useEffect, useState } from "react";
import { env } from "../env";
import { AuthContext } from "../lib/utils";

// Define user type
export type User = {
  id: string;
  email: string;
  username: string;
};

// Define context type
export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
};

// Create context

// AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  // Fetch user from token on load
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const res = await axios.get(`${env.SERVER_URL}/context/me/`, {
          headers: { authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("Token validation failed:", error);
        setUser(null);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (jwt: string) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
