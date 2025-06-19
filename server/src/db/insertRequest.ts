import { supabase } from "../supabase";
import { MemeTag } from "../types";
import type { Meme } from "../types";

export const insertMeme = async ({ meme }: { meme: Meme }) => {
  try {
    await supabase
      .from("memes")
      .insert({
        title: meme.title,
        image_url: meme.image_url || "https://picsum.photos/200",
        upvotes: meme.upvotes,
        owner_id: meme.owner_id,
        tags: meme.tags,
        downvotes: meme.downvotes,
        ai_caption: meme.ai_caption,
        ai_vibe: meme.ai_vibe,
      })
      .select()
      .single();
    return { status: true, message: "Create Successfully" };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
