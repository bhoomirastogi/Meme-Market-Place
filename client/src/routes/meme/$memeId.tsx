import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type Meme } from "../../types/memes";

export const Route = createFileRoute("/meme/$memeId")({
  component: MemeDetail,
});

function MemeDetail() {
  const { memeId } = useParams({ from: "/meme/$memeId" });

  const {
    data: meme,
    isLoading,
    error,
  } = useQuery<Meme>({
    queryKey: ["meme", memeId],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3000/api/v1/meme/${memeId}`
      );
      return res.data;
    },
  });
  console.log(meme);
  if (isLoading)
    return <p className="text-pink-400">Loading meme details...</p>;
  if (error || !meme)
    return <p className="text-red-500">Failed to load meme.</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto bg-gradient-to-br from-pink-500/10 to-indigo-800/10 p-6 rounded-xl border border-pink-500">
        <img
          src={meme.image_url}
          alt={meme.title}
          className="w-full h-80 object-cover rounded-lg border border-pink-500 mb-4"
        />
        <h1 className="text-3xl font-bold text-pink-400 mb-2">{meme.title}</h1>

        <div className="text-gray-300 mb-2">
          <span>🔥 {meme.upvotes}</span> &nbsp;&nbsp;
          <span>💔 {meme.downvotes}</span>
        </div>

        <p className="mb-2">
          <span className="text-pink-400">🤖 AI Caption:</span>{" "}
          {meme.ai_caption}
        </p>

        {meme.ai_vibe && (
          <p className="mb-2">
            <span className="text-indigo-400">🎭 Vibe:</span> {meme.ai_vibe}
          </p>
        )}

        <div className="mb-2 text-sm text-gray-400">
          <span>🧑 Owner ID:</span> {meme.owner_id}
        </div>

        {meme.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {meme.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-pink-600 text-white px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
