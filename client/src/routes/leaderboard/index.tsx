import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { io } from "socket.io-client";
import { env } from "../../env";

const socket = io(env.SERVER_URL);

export const Route = createFileRoute("/leaderboard/")({
  component: RouteComponent,
});

type LeaderboardMeme = {
  id: string;
  title: string;
  image_url: string;
  highestBid: number;
  highestBidder: string;
  highestBidderName: string;
  credits: string;
};

type UserBid = {
  meme_id: string;
  user_id: string;
  credits: number;
  meme_title: string;
  username: string;
};

function RouteComponent() {
  const [memes, setMemes] = useState<LeaderboardMeme[]>([]);
  const [userBids, setUserBids] = useState<UserBid[]>([]);

  const fetchLeaderboard = async () => {
    const res = await axios.get(`${env.SERVER_URL}/api/leaderboard`);

    setMemes(res.data.memeLeaderboard);
    setUserBids(res.data.userLeaderboard);
  };

  useEffect(() => {
    fetchLeaderboard();

    socket.on("meme:bid", ({ meme_id, highestBid, highestBidder }) => {
      setMemes((prev) => {
        const updated = prev.map((m) =>
          m.id === meme_id ? { ...m, highestBid, highestBidder } : m
        );

        return [...updated].sort((a, b) => b.highestBid - a.highestBid);
      });
    });

    socket.on(
      "leaderboard:user:bid",
      ({ user_id, username, credits, meme_title, meme_id }) => {
        setUserBids((prev) => {
          const filtered = prev.filter((b) => b.user_id !== user_id);

          return [
            ...filtered,
            { user_id, username, credits, meme_title, meme_id },
          ].sort((a, b) => b.credits - a.credits);
        });
      }
    );

    return () => {
      socket.off("meme:bid");
      socket.off("leaderboard:user:bid");
    };
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
      <div>
        <h1 className="text-2xl font-bold text-pink-400 mb-4">
          🏆 Meme Leaderboard
        </h1>
        <AnimatePresence>
          {memes.map((meme, index) => (
            <motion.div
              key={meme.id + meme.credits}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-indigo-800/10 to-pink-600/10 border border-pink-400 rounded-lg p-4 flex items-center gap-4 mb-3">
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
                  💰 Highest Bid: <b>{meme.credits}</b>
                </p>
                <p className="text-cyan-300">
                  🧑 Highest Bidder: {meme.highestBidderName}...
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-indigo-400 mb-4">
          👤 Top Bidders
        </h1>
        <AnimatePresence>
          {userBids.map((bid, index) => (
            <motion.div
              key={bid.user_id + bid.credits}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-cyan-800/10 to-purple-600/10 border border-indigo-400 rounded-lg p-4 mb-3">
              <h2 className="text-lg text-white font-semibold">
                #{index + 1} — {bid.username}
              </h2>
              <p className="text-yellow-300">
                💸 Bid: <b>{bid.credits}</b> credits
              </p>
              <Link
                to="/meme/$memeId"
                params={{ memeId: bid.meme_id! }}
                className="block">
                <p className="text-pink-300">
                  🎯 On Meme: <b>{bid.meme_title}</b>
                </p>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
