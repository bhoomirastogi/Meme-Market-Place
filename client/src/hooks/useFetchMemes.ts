import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type Meme } from "./../types/index";

export const useFetchMemes = () => {
  return useQuery<Meme[]>({
    queryKey: ["memes"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/api/v1/meme");
      return res.data;
    },
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
  });
};
