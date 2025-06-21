import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { io } from "socket.io-client";

type LeaderboardMeme = {
  id: string;
  title: string;
  image_url: string;
  highestBid: number;
  highestBidder: string;
};

export const socket = io("http://localhost:3000");
export const Route = createFileRoute("/leaderboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [memes, setMemes] = useState<LeaderboardMeme[]>([]);

  const fetchLeaderboard = async () => {
    const res = await axios.get("http://localhost:3000/api/leaderboard");
    setMemes(res.data.leaderboard);
  };

  useEffect(() => {
    fetchLeaderboard();

    socket.on("meme:bid", ({ meme_id, highestBid, highestBidder }) => {
      setMemes((prev) => {
        const updated = prev.map((m) =>
          m.id === meme_id ? { ...m, highestBid, highestBidder } : m
        );
        return [...updated].sort(
          (a, b) => (b.highestBid || 0) - (a.highestBid || 0)
        );
      });
    });

    return () => {
      socket.off("meme:bid");
    };
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-pink-400 mb-6">
        🏆 Meme Bidding Leaderboard
      </h1>
      <AnimatePresence>
        {memes.map((meme, index) => (
          <motion.div
            key={meme.id + meme.highestBid} // ensure re-animation on bid change
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-indigo-800/10 to-pink-600/10 border border-pink-400 rounded-lg p-4 flex items-center gap-4 mb-3"
          >
            <img
              src={meme.image_url}
              alt={meme.title}
              className="w-20 h-20 object-cover rounded-md border border-pink-500"
            />
            <div>
              <h2 className="text-lg text-white font-semibold">
                #{index + 1} — {meme.title}
              </h2>
              <p className="text-yellow-300">
                💰 Highest Bid: <b>{meme.highestBid}</b>
              </p>
              <p className="text-cyan-300">
                🧑 Highest Bidder:{" "}
                <span>{meme.highestBidder.slice(0, 6)}...</span>
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
