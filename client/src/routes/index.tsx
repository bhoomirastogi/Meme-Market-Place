import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CreateMemeForm } from "../components/CreateMemeForm";
import { useFetchMemes } from "../hooks/useFetchMemes";
import { useMemeSocket } from "../hooks/useMemeSocket";
import { MemeCard } from "../components/MemeCard";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data, isLoading, error } = useFetchMemes();

  const [showForm, setShowForm] = useState(false);

  useMemeSocket();

  if (isLoading) return <p className="text-pink-500">Loading memes...</p>;
  if (error) return <p className="text-red-500">Error loading memes!</p>;

  return (
    <div className="p-6  min-h-screen container mx-auto text-white font-mono">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold neon-glow">
          ⚡ MemeHustle Market
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-pink-600 hover:bg-pink-500 transition px-4 py-2 rounded shadow neon-border"
        >
          ➕ Create Meme
        </button>
      </div>

      {showForm && <CreateMemeForm onClose={() => setShowForm(false)} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data?.map((meme) => <MemeCard key={meme.id} meme={meme} />)}
      </div>
    </div>
  );
}
