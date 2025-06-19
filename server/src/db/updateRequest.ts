import { supabase } from "../supabase";

export const updateVote = async (newVotes: number, id: string) => {
  try {
    await supabase.from("memes").update({ upvotes: newVotes }).eq("id", id);

    return { status: true, message: "+1 Vote" };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
