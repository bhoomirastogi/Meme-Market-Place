import { Link } from "@tanstack/react-router";
import { type Meme } from "../types/memes";
import { useState } from "react";

import clsx from "clsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const MemeCard = ({ meme }: { meme: Meme }) => {
  const queryClient = useQueryClient();
  const [upvotes, setUpvotes] = useState(meme.upvotes);
  const [downvotes, setDownvotes] = useState(meme.downvotes);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);
  const { mutate } = useMutation({
    mutationFn: async (type: string) => {
      return axios.post("http://localhost:3000/api/vote", {
        meme_id: meme.id,
        user_id: meme.owner_id,
        type,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["votes"] });
    },
  });
  const handleVote = (type: "up" | "down") => {
    if (voted === type) return; // prevent same vote again in this session
    mutate(type);

    if (type === "up") setUpvotes((prev) => prev + 1);
    if (type === "down") setDownvotes((prev) => prev + 1);
    setVoted(type);
  };

  return (
    <div className="relative bg-gradient-to-br from-pink-500/10 to-indigo-800/5 rounded-xl border border-pink-500 hover:scale-[1.02] transition duration-300 p-4 shadow-lg backdrop-blur-sm group">
      <Link to="/meme/$memeId" params={{ memeId: meme.id! }} className="block">
        <img
          src={meme.image_url}
          alt={meme.title}
          className="w-full h-52 object-cover rounded-md border border-pink-500 mb-4 group-hover:shadow-pink-500/30 group-hover:shadow-lg"
        />
      </Link>

      <h2 className="text-xl font-bold text-pink-400 mb-1">{meme.title}</h2>

      <div className="flex gap-2 items-center mb-3">
        <button
          onClick={() => handleVote("up")}
          disabled={voted === "up"}
          className={clsx(
            "text-xs px-2 py-1 rounded bg-pink-600 text-white hover:bg-pink-500",
            voted === "up" && "opacity-60"
          )}>
          🔼 {upvotes}
        </button>

        <button
          onClick={() => handleVote("down")}
          disabled={voted === "down"}
          className={clsx(
            "text-xs px-2 py-1 rounded bg-gray-700 text-white hover:bg-gray-600",
            voted === "down" && "opacity-60"
          )}>
          🔽 {downvotes}
        </button>
      </div>

      {meme.ai_caption && (
        <div className="text-sm text-white mb-2">
          <span className="text-pink-400">🤖 Caption:</span> {meme.ai_caption}
        </div>
      )}

      {meme.ai_vibe && (
        <div className="text-sm text-indigo-300 mb-2">
          <span className="text-indigo-400">🎭 Vibe:</span> {meme.ai_vibe}
        </div>
      )}

      {meme.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {meme.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-pink-600 text-white px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="absolute top-2 right-3 text-xs text-gray-400">
        🧑‍🚀 {meme.owner_id.slice(0, 6)}...
      </div>
    </div>
  );
};
