import axios from "axios";
import { env } from "../env";

const geminiCache: Record<string, string> = {};
const fallbackCaptions = [
  "To the MOON!",
  "Brrr goes stonks",
  "YOLO to the moon!",
];

export const fetchGeminiResponse = async (
  tags: string[],
  promptTemplate: (tags: string[]) => string,
  fallbackText = fallbackCaptions[
    Math.floor(Math.random() * fallbackCaptions.length)
  ]
): Promise<string> => {
  const key = tags.sort().join(",") + "|" + promptTemplate(tags);

  if (geminiCache[key]) return geminiCache[key];

  try {
    const res = await axios.post(env.VITE_GEMINI_URL, {
      contents: [
        {
          parts: [
            {
              text: promptTemplate(tags),
            },
          ],
        },
      ],
    });

    const result =
      res.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      fallbackText;

    geminiCache[key] = result;
    return result;
  } catch (err) {
    console.warn("Gemini fallback error", err);
    return fallbackText;
  }
};
