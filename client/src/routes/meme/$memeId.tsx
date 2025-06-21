import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type memePostSchemaType } from "../../types/memes";

export const Route = createFileRoute("/meme/$memeId")({
  component: MemeDetail,
});

function MemeDetail() {
  const { memeId } = useParams({ from: "/meme/$memeId" });

  const {
    data: meme,
    isLoading,
    error,
  } = useQuery<memePostSchemaType>({
    queryKey: ["meme", memeId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3000/api/v1/meme/${memeId}`
      );
      return res.data;
    },
  });

  if (isLoading)
    return (
      <p className="text-pink-400 text-center mt-10 text-lg animate-pulse">
        Loading meme details...
      </p>
    );

  if (error || !meme)
    return (
      <p className="text-red-500 text-center mt-10 text-lg">
        Failed to load meme.
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f1f] via-black to-[#0a0a1a] text-white p-4 sm:p-8 font-mono">
      <div className="max-w-4xl mx-auto bg-[#0f0f23] p-6 md:p-10 rounded-xl border border-pink-500 shadow-[0_0_20px_#ff00cc55] relative">
        {/* Image */}
        <div className="relative aspect-video bg-black border border-pink-500 rounded-lg overflow-hidden shadow-lg">
          <img
            src={meme.image_url}
            alt={meme.title}
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-2 right-2 text-xs text-white bg-black/60 px-2 py-1 rounded-md">
            {new Date(meme.created_at || "").toLocaleString()}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-pink-400 mt-6 mb-2 animate-fade-in">
          {meme.title}
        </h1>

        {/* Stats */}
        <div className="text-sm text-gray-400 mb-4 flex flex-wrap gap-4">
          <span className="flex items-center gap-1">
            🔥 <span className="text-white">{meme.upvotes}</span> Upvotes
          </span>
          <span>
            🧑 Owner:{" "}
            <span className="text-blue-400 font-medium">
              {meme.owner_id?.username || "Anonymous"}
            </span>
          </span>
        </div>

        {/* AI Details */}
        <div className="space-y-3 mb-6">
          {meme.ai_caption && (
            <p className="text-lg">
              <span className="text-pink-500 font-semibold">🤖 Caption:</span>{" "}
              <span className="text-white">{meme.ai_caption}</span>
            </p>
          )}
          {meme.ai_vibe && (
            <p className="text-lg">
              <span className="text-indigo-400 font-semibold">🎭 Vibe:</span>{" "}
              <span className="text-white">{meme.ai_vibe}</span>
            </p>
          )}
        </div>

        {/* Tags */}
        {meme.tags && meme.tags.length > 0 && (
          <>
            <h3 className="text-pink-400 font-semibold text-lg mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {meme.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gradient-to-br from-pink-600 to-purple-700 text-white px-3 py-1 rounded-full hover:scale-105 transition-transform duration-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
