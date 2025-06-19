// hooks/useMemeSocket.ts
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { type Meme } from "../types/memes";

const socket = io("http://localhost:4000"); // or your ENV URL

export const useMemeSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on("meme:created", (meme: Meme) => {
      console.log("📡 New meme:", meme);
      queryClient.setQueryData(["memes"], (old: Meme[] = []) => [meme, ...old]);
    });

    return () => {
      socket.off("meme:created");
    };
  }, []);
};
