// hooks/useMemeSocket.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { type Meme } from "../types/memes";
import { socket } from "../lib/utils";

export const useMemeSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on("meme:created", (meme: Meme) => {
      queryClient.setQueryData(["memes"], (old: Meme[] = []) => [meme, ...old]);
    });

    return () => {
      socket.off("meme:created");
    };
  }, [queryClient]);
};
