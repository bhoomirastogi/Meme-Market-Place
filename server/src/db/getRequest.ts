import { supabase } from "../supabase";

export const getMemeQuery = async (
  sort: string = "created_at",
  order: string = "desc"
) => {
  try {
    const { data } = await supabase
      .from("memes")
      .select("*")
      .order(sort, { ascending: order === "asc" });
    return { status: true, message: data };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getMemeVoteByID = async (id: string) => {
  try {
    const meme = await supabase
      .from("memes")
      .select("upvotes")
      .eq("id", id)
      .single();

    if (!meme) return { status: false, message: "No Meme Found" };

    return { status: true, message: meme.data };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
export const getMemeByID = async (id: string) => {
  try {
    const meme = await supabase.from("memes").select("*").eq("id", id).single();

    if (!meme) return { status: false, message: "No Meme Found" };

    return { status: true, message: meme.data?.upvotes };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
