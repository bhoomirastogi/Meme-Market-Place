import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useOptimistic, useState } from "react";
import { env } from "../env";
import { useAuth } from "../hooks/useAuth";
import { type Meme, type Vote } from "../types/memes";
import { socket } from "../lib/utils";
import { Votes } from "./votes";
import { Link } from "@tanstack/react-router";
import { DialogBox } from "./Dialog";

export const MemeCard = ({ meme }: { meme: Meme }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  const [upvotes, setUpvotes] = useState(meme.upvotes);
  const [bidAmount, setBidAmount] = useState("");
  const [highestBid, setHighestBid] = useState<number | null>(null);
  const [highestBidder, setHighestBidder] = useState<string | null>(null);
  const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);

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
    if (user?.credits! < bid) {
      setShowInsufficientCredits(true);
      return;
    }
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
    <div className="relative bg-[#13131a] border border-pink-500 rounded-xl shadow-xl p-4 transition hover:scale-[1.02]">
      <Link to="/meme/$memeId" params={{ memeId: meme.id }}>
        <img
          src={meme.image_url}
          alt={meme.title}
          className="w-full h-56 object-cover rounded-lg border border-pink-400 mb-3"
        />
      </Link>

      <h2 className="text-lg font-semibold text-pink-400 mb-1">{meme.title}</h2>

      <Votes
        upvotes={upvotes}
        handleVote={handleVote}
        optimisticVoted={optimisticVoted}
        isPending={isVoting}
      />

      <form onSubmit={handleBidSubmit} className="flex gap-2 mt-3">
        <input
          type="number"
          placeholder="Bid credits"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="w-24 px-2 py-1 text-sm rounded bg-[#1e1e2e] border border-pink-500 text-white"
        />
        <button
          type="submit"
          disabled={isPlacingBid}
          className="bg-pink-600 hover:bg-pink-700 text-white text-sm px-4 py-1 rounded"
        >
          Bid
        </button>
      </form>

      {highestBid && highestBidder && (
        <div className="text-sm text-cyan-300 mt-1">
          👑 <b>{highestBid}</b> by {highestBidder.slice(0, 6)}...
        </div>
      )}

      {bidStats && (
        <div className="text-sm text-yellow-300 mt-1">
          🪙 <b>{bidStats.totalBids}</b> bids | 💰{" "}
          <b>{bidStats.totalCredits}</b> credits
        </div>
      )}

      {meme.ai_caption && (
        <p className="mt-2 text-sm text-white">
          <span className="text-pink-400">🤖 Caption:</span> {meme.ai_caption}
        </p>
      )}

      {meme.ai_vibe && (
        <p className="mt-1 text-sm text-indigo-300">
          <span className="text-indigo-400">🎭 Vibe:</span> {meme.ai_vibe}
        </p>
      )}

      {meme.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {meme.tags.map((tag) => (
            <span
              key={tag}
              className="bg-pink-600 text-white text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="absolute top-2 right-3 text-xs text-gray-400">
        🧑‍🚀 {meme.owner_id.slice(0, 6)}...
      </div>

      <DialogBox
        open={showInsufficientCredits}
        onClose={() => setShowInsufficientCredits(false)}
        title="Insufficient Credits"
      >
        You don’t have enough credits to place this bid. Please enter a lower
        amount or add more credits.
      </DialogBox>
    </div>
  );
};
