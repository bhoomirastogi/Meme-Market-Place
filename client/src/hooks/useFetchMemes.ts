import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type Meme } from "./../types/index";
import { env } from "../env";

export const useFetchMemes = () => {
  return useQuery<Meme[]>({
    queryKey: ["memes"],
    queryFn: async () => {
      const res = await axios.get(`${env.SERVER_URL}/api/v1/meme`);
      return res.data;
    },
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
  });
};
