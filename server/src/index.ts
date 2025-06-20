import express from "express";
import { createServer } from "http"; // ✅ you missed this earlier
import { Server } from "socket.io";
import { memeRouter } from "./routes/memes";
import { logger } from "./middleware/logger";
import { StatusCodes } from "http-status-codes";
import { corsConfig } from "./corsConfig";
import { env } from "./env/envSchema";
import { errorHandlerMiddleware } from "./middleware/errorHandler";
import { supabase } from "./supabase";
import { voteRouter } from "./routes/votes";
import { bidsRouter } from "./routes/bids";

const app = express();
const PORT = env.PORT;

const server = createServer(app); // ✅ HTTP server for socket.io

export const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL,
  },
});

io.on("connection", (socket) => {
  socket.on("vote:meme", async ({ meme_id, user_id, type }) => {
    // Optionally check if the vote already exists in the "votes" table

    await supabase.from("votes").insert({
      meme_id,
      user_id,
      type,
      created_at: new Date().toISOString(),
    });

    // Update meme vote count

    // Fetch updated meme
    const { data: updatedMeme } = await supabase
      .from("memes")
      .select("*")
      .eq("id", meme_id)
      .single();

    // Broadcast updated meme
    io.emit("meme:updated", updatedMeme);
  });
});

app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/", logger, memeRouter);
app.use("/api/", logger, voteRouter);
app.use("/api/", logger, bidsRouter);
app.use(errorHandlerMiddleware);

app.get("/", (req, res) => {
  console.log("Heelo");
  res.status(StatusCodes.OK).json({ root: "Helel" });
});

// ✅ THIS is important: Listen on the `server`, not `app`
server.listen(PORT, () => {
  console.log(
    `🚀 Server (with Socket.IO) running on ${env.SERVER_URL}:${PORT}`
  );
});
