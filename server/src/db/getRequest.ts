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

export const getBidsById = async (id: string) => {
  try {
    const { data } = await supabase
      .from("memes")
      .select("*")
      .eq("id", id)
      .single();
    return { status: true, message: data?.credits };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getMemeUpVoteByID = async (id: string) => {
  console.log(id);
  try {
    const meme = await supabase
      .from("memes")
      .select("upvotes")
      .eq("id", id)
      .single();

    if (!meme) return { status: false, message: "No Meme Found" };
    console.log(meme);
    return { status: true, message: meme.data! };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getMemeByID = async (id: string) => {
  try {
    const meme = await supabase
      .from("memes")
      .select("*,owner_id (id,username)")
      .eq("id", id)
      .single();

    if (!meme) return { status: false, message: "No Meme Found" };
    console.log(meme);
    return { status: true, message: meme.data };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getAllVote = async () => {
  try {
    const meme = await supabase.from("votes").select("*").single();

    if (!meme) return { status: false, message: "No Meme Found" };

    return { status: true, message: meme.data };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
