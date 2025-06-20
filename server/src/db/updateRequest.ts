import { supabase } from "../supabase";

export const updateUpVote = async (
  meme_id: string,
  user_id: string,
  type: "up"
) => {
  try {
    // Check if vote already exists
    const { data: existingVote } = await supabase
      .from("votes")
      .select("*")
      .eq("meme_id", meme_id)
      .eq("user_id", user_id)
      .single();

    // Get current upvotes
    const { data: memeData } = await supabase
      .from("memes")
      .select("upvotes")
      .eq("id", meme_id)
      .single();

    let newVotes = memeData?.upvotes || 0;

    if (existingVote) {
      // Remove vote
      await supabase.from("votes").delete().eq("id", existingVote.id);
      newVotes -= 1;
      await supabase
        .from("memes")
        .update({ upvotes: newVotes })
        .eq("id", meme_id);
      return { status: true, message: "Vote removed" };
    } else {
      // Add vote
      await supabase.from("votes").insert({
        meme_id,
        type,
        user_id,
        created_at: new Date().toISOString(),
      });
      newVotes += 1;
      await supabase
        .from("memes")
        .update({ upvotes: newVotes })
        .eq("id", meme_id);
      return { status: true, message: "Vote added" };
    }
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
