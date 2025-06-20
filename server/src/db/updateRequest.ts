import { supabase } from "../supabase";

export const updateBids = async (id: string, credits: number) => {
  try {
    console.log(id, " and ", credits);
    await supabase.from("memes").update({ credits: credits }).eq("id", id);
    return { status: true, message: "Done" };
  } catch (error) {
    return {
      status: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
