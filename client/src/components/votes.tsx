import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

type VotesProps = {
  upvotes: number;
  handleVote: () => void;
  isPending: boolean;
  optimisticVoted: boolean;
};

export const Votes = ({
  upvotes,
  handleVote,
  isPending,
  optimisticVoted,
}: VotesProps) => {
  return (
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
            initial={{ scale: 0, rotate: -20, opacity: 0 }}
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
  );
};
