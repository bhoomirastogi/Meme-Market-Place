import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FileUpload } from "primereact/fileupload";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { fetchGeminiResponse } from "../lib/gemini";
import { memeSchema } from "../types/memes";
import { supabase } from "./../lib/supabase"; // your Supabase client

// Replace with env variable in prod

type MemeFormData = z.infer<typeof memeSchema>;

export const CreateMemeForm = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient();
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<MemeFormData>({
    resolver: zodResolver(memeSchema),
    defaultValues: {
      ai_caption: "",
      ai_vibe: "",
      credits: 0,
      owner_id: "",
      title: "",
      upvotes: 0,
      tags: [],
      image_url: "https://picsum.photos/200",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: MemeFormData) => {
      return axios.post("http://localhost:3000/api/v1/meme", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memes"] });
      onClose();
    },
  });

  const addTag = () => {
    const currentTags = getValues("tags");
    if (tagInput.trim() && !currentTags.includes(tagInput)) {
      setValue("tags", [...currentTags, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setValue(
      "tags",
      getValues("tags").filter((t) => t !== tag)
    );
  };

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}.${ext}`;
    const path = `memes/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from("meme-image")
      .upload(path, file, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Upload Error:", uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from("meme-image").getPublicUrl(path);
    return data.publicUrl ?? null;
  };

  const onSubmit: SubmitHandler<MemeFormData> = async (data) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      let imageUrl = data.image_url;

      // Upload image if provided
      if (imageFile) {
        const uploadedUrl = await uploadImageToSupabase(imageFile);
        if (!uploadedUrl) {
          alert("Image upload failed!");
          setIsSubmitting(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      // ✅ Generate AI Caption and Vibe inside the async block
      const ai_caption = await fetchGeminiResponse(
        data.tags,
        (tags) =>
          `Write a very short, funny meme caption (max 10 words) for tags: ${tags.join(", ")}. Format it like a punchline.`
      );

      const ai_vibe = await fetchGeminiResponse(
        data.tags,
        (tags) =>
          `Based on the tags: ${tags.join(", ")}, generate a 5-7 word punchline that combines all tags into one creative vibe. Return only the phrase without any intro, explanation, hashtags, or formatting. Avoid full sentences.`,
        "Cyber Chaos"
      );

      // Prepare final data
      const finalData = {
        ...data,
        image_url: imageUrl,
        ai_caption,
        ai_vibe,
      };

      // Submit meme
      mutate(finalData, {
        onSettled: () => {
          setIsSubmitting(false);
        },
      });
    } catch (err) {
      console.error("Submit error", err);
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#111] border border-pink-500 p-6 rounded-xl shadow-xl space-y-4"
    >
      <h2 className="text-pink-400 font-bold text-2xl mb-2">Create Meme</h2>

      <input
        {...register("title")}
        placeholder="Meme Title"
        className="w-full px-4 py-2 bg-black border border-pink-500 text-white rounded"
      />
      {errors.title && (
        <p className="text-red-400 text-sm">{errors.title.message}</p>
      )}

      <FileUpload
        mode="basic"
        name="meme-image"
        accept="image/*"
        maxFileSize={1000000}
        auto
        customUpload
        uploadHandler={({ files }) => {
          const file = files[0];
          if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
          }
        }}
      />

      {previewUrl && (
        <div className="mt-2">
          <p className="text-sm text-pink-400 mb-1">Preview:</p>
          <img
            src={previewUrl}
            alt="Uploaded Preview"
            className="w-full h-48 object-cover rounded border border-pink-500"
          />
        </div>
      )}

      <input
        {...register("owner_id")}
        placeholder="Owner UUID"
        className="w-full px-4 py-2 bg-black border border-pink-500 text-white rounded"
      />
      {errors.owner_id && (
        <p className="text-red-400 text-sm">{errors.owner_id.message}</p>
      )}

      <div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add Tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-grow px-4 py-2 bg-black border border-pink-500 text-white rounded"
          />
          <button
            type="button"
            onClick={addTag}
            className="bg-pink-600 px-4 py-2 rounded text-white"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {getValues("tags").map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-sm bg-pink-500 text-black rounded cursor-pointer"
              onClick={() => removeTag(tag)}
            >
              {tag} ✕
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="submit"
          disabled={isPending || isSubmitting}
          className="bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded"
        >
          {isPending || isSubmitting ? "Creating..." : "Create Meme"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
