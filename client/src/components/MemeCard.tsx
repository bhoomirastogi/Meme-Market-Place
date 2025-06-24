import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import { useEffect, useOptimistic, useState } from "react";
import { env } from "../env";
import { useAuth } from "../hooks/useAuth";
import { type Meme, type Vote } from "../types/memes";
import { socket } from "../lib/utils";
import { Votes } from "./votes";
import { Link } from "@tanstack/react-router";

export const MemeCard = ({ meme }: { meme: Meme }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  const [upvotes, setUpvotes] = useState(meme.upvotes);
  const [bidAmount, setBidAmount] = useState("");
  const [highestBid, setHighestBid] = useState<number | null>(null);
  const [highestBidder, setHighestBidder] = useState<string | null>(null);

  useEffect(() => {
    const voteHandler = (data: { meme_id: string; upvotes: number }) => {
      if (data.meme_id === meme.id) setUpvotes(data.upvotes);
    };

    const bidHandler = (data: {
      meme_id: string;
      highestBid: number;
      highestBidder: string;
    }) => {
      if (data.meme_id === meme.id) {
        setHighestBid(data.highestBid);
        setHighestBidder(data.highestBidder);
        queryClient.invalidateQueries({ queryKey: ["bids", meme.id, "total"] });
      }
    };

    socket.on("meme:vote", voteHandler);
    socket.on("meme:bid", bidHandler);

    return () => {
      socket.off("meme:vote", voteHandler);
      socket.off("meme:bid", bidHandler);
    };
  }, [meme.id, queryClient]);

  const { data: userVotes } = useQuery({
    queryKey: ["user-votes", userId],
    queryFn: async () => {
      const res = await axios.get<Vote[]>(
        `${env.SERVER_URL}/api/vote?user_id=${userId}`
      );
      return res.data;
    },
    enabled: !!userId,
  });

  const alreadyVoted =
    userVotes?.some((vote) => vote.meme_id === meme.id) || false;

  const [optimisticVoted, toggleVote] = useOptimistic(
    alreadyVoted,
    (prev: boolean) => !prev
  );

  const { mutate: voteMutate, isPending: isVoting } = useMutation({
    mutationFn: async () =>
      axios.post(`${env.SERVER_URL}/api/vote`, {
        meme_id: meme.id,
        user_id: userId,
        type: "up",
      }),
    onSuccess: (res) => {
      setUpvotes(res.data.upvotes);
      queryClient.invalidateQueries({ queryKey: ["user-votes", userId] });
      queryClient.invalidateQueries({ queryKey: ["memes"] });
    },
  });

  const handleVote = () => {
    if (isVoting) return;
    toggleVote(alreadyVoted);
    voteMutate();
  };

  const { mutate: placeBid, isPending: isPlacingBid } = useMutation({
    mutationFn: async () =>
      axios.post(`${env.SERVER_URL}/api/bids`, {
        meme_id: meme.id,
        user_id: userId,
        credits: parseInt(bidAmount),
      }),
    onSuccess: () => {
      setBidAmount("");
      queryClient.invalidateQueries({ queryKey: ["bids", meme.id, "total"] });
    },
  });

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bid = parseInt(bidAmount);
    if (!bid || isNaN(bid) || bid <= 0) return;

    socket.emit("bid:meme", {
      meme_id: meme.id,
      user_id: userId,
      credits: bid,
    });
    placeBid();
  };

  const { data: bidStats } = useQuery({
    queryKey: ["bids", meme.id, "total"],
    queryFn: async () => {
      const res = await axios.get<{
        totalCredits: number;
        totalBids: number;
      }>(`${env.SERVER_URL}/api/bids?meme_id=${meme.id}`);
      return res.data;
    },
  });

  return (
    <div className="relative bg-gradient-to-br from-pink-500/10 to-indigo-800/5 rounded-xl border border-pink-500 hover:scale-[1.02] transition duration-300 p-4 shadow-lg backdrop-blur-sm group">
      <Link to="/meme/$memeId" params={{ memeId: meme.id }} className="block">
        <img
          src={meme.image_url}
          alt={meme.title}
          className="w-full h-52 object-cover rounded-md border border-pink-500 mb-4 group-hover:shadow-pink-500/30 group-hover:shadow-lg"
        />
      </Link>

      <h2 className="text-xl font-bold text-pink-400 mb-1">{meme.title}</h2>

      {/* ✅ Likes Section */}
      <Votes
        upvotes={upvotes}
        handleVote={handleVote}
        optimisticVoted={optimisticVoted}
        isPending={isVoting}
      />

      {/* ✅ Bidding Form */}
      <form onSubmit={handleBidSubmit} className="mt-3 flex gap-2">
        <input
          type="number"
          placeholder="Your bid"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="w-24 text-sm px-2 py-1 rounded border border-pink-400 bg-transparent text-white placeholder:text-pink-200"
        />
        <button
          type="submit"
          disabled={isPlacingBid}
          className="px-3 py-1 text-xs rounded bg-pink-600 text-white hover:bg-pink-500"
        >
          Place Bid
        </button>
      </form>

      {highestBid && highestBidder && (
        <div className="text-sm text-cyan-300 mt-1">
          👑 Highest Bid: <b>{highestBid}</b> by {highestBidder.slice(0, 6)}...
        </div>
      )}

      {bidStats && (
        <div className="text-sm text-yellow-300 mt-2">
          💰 Total Bids:{" "}
          <span className="font-semibold">{bidStats.totalBids}</span> | 🪙 Total
          Credits:{" "}
          <span className="font-semibold">{bidStats.totalCredits}</span>
        </div>
      )}

      {/* ✅ AI Caption & Vibe */}
      {meme.ai_caption && (
        <div className="text-sm text-white mt-2">
          <span className="text-pink-400">🤖 Caption:</span> {meme.ai_caption}
        </div>
      )}

      {meme.ai_vibe && (
        <div className="text-sm text-indigo-300 mt-1">
          <span className="text-indigo-400">🎭 Vibe:</span> {meme.ai_vibe}
        </div>
      )}

      {/* ✅ Tags */}
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
