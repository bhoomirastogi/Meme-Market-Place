import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { useOptimistic, useState } from "react";
import { type Meme, type Vote } from "../types/memes";

export const MemeCard = ({ meme }: { meme: Meme }) => {
  const userId = meme.owner_id; // Replace this with actual logged-in user ID
  const queryClient = useQueryClient();

  const [upvotes, setUpvotes] = useState(meme.upvotes);

  // ✅ Fetch user votes
  const { data: userVotes } = useQuery({
    queryKey: ["user-votes", userId],
    queryFn: async () => {
      const res = await axios.get<Vote[]>(
        `http://localhost:3000/api/vote?user_id=${userId}`
      );
      return res.data;
    },
  });

  const alreadyVoted = Array.isArray(userVotes)
    ? userVotes.some((vote) => vote.meme_id === meme.id)
    : false;
  const [optimisticVoted, toggleVote] = useOptimistic(
    alreadyVoted,
    (prev: boolean) => !prev
  );

  // ✅ Vote mutation
  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      axios.post("http://localhost:3000/api/vote", {
        meme_id: meme.id,
        user_id: userId,
        type: "up",
      }),
    onSuccess: (res) => {
      const updatedVotes = res.data.upvotes;
      setUpvotes(updatedVotes);

      queryClient.invalidateQueries({ queryKey: ["user-votes", userId] });
      queryClient.invalidateQueries({ queryKey: ["memes"] });
    },
  });

  const handleVote = () => {
    if (isPending) return;
    toggleVote(alreadyVoted); // ✅ pass action argument
    mutate(); // toggle handled on backend
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
          onClick={handleVote}
          disabled={isPending}
          className={clsx(
            "relative w-8 h-8 flex items-center justify-center bg-transparent hover:scale-110 active:scale-90 transition-transform",
            isPending && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Toggle Like"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={optimisticVoted ? "liked" : "unliked"}
              initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
              animate={{ scale: 1.3, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.3, rotate: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="text-2xl"
            >
              {optimisticVoted ? "❤️" : "🤍"}
            </motion.span>
          </AnimatePresence>
        </button>

        <span className="ml-2 text-sm text-white">{upvotes} Likes</span>
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
              className="text-xs bg-pink-600 text-white px-2 py-1 rounded-full"
            >
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
