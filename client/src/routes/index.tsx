import { createFileRoute } from "@tanstack/react-router";
import { MemeCard } from "../components/MemeCard";
import { useFetchMemes } from "../hooks/useFetchMemes";
import { useMemeSocket } from "../hooks/useMemeSocket";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data, isLoading, error } = useFetchMemes();

  useMemeSocket();

  if (isLoading) return <p className="text-pink-500">Loading memes...</p>;
  if (error) return <p className="text-red-500">Error loading memes!</p>;

  return (
    <div className="p-6  min-h-screen container mx-auto text-white font-mono">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data?.map((meme) => <MemeCard key={meme.id} meme={meme} />)}
      </div>
    </div>
  );
}
