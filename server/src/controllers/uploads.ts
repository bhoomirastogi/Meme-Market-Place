import { Request, Response } from "express";
import { supabase } from "../supabase"; // make sure your Supabase client is correctly imported
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadImageMiddleware = upload.single("meme-image");

export const uploadImageToSupabase = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const ext = file.originalname.split(".").pop();
    const filename = `${Date.now()}.${ext}`;
    const path = `memes/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from("meme-image")
      .upload(path, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("meme-image")
      .getPublicUrl(path);
    console.log(publicUrlData.publicUrl);
    res.status(200).json({ url: publicUrlData.publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};
