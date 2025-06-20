import { supabase } from "../supabase";
import type { Meme } from "../types";

export const insertMeme = async ({ meme }: { meme: Meme }) => {
  try {
    const { data } = await supabase
      .from("memes")
      .insert({
        title: meme.title,
        image_url: meme.image_url || "https://picsum.photos/200",
        upvotes: meme.upvotes,
        owner_id: meme.owner_id,
        tags: meme.tags,
        credits: 0,
        ai_caption: meme.ai_caption,
        ai_vibe: meme.ai_vibe,
      })
      .select()
      .single();
    return { status: true, message: data };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
