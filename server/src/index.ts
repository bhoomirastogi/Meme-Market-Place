import express from "express";

import { memeRouter } from "./routes/memes";
import { logger } from "./middleware/logger";
import { StatusCodes } from "http-status-codes";
import { corsConfig } from "./corsConfig";
import { env } from "./env/envSchema";
import { errorHandlerMiddleware } from "./middleware/errorHandler";
const app = express();
const PORT = env.PORT;
app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(logger);
app.use("/api/v1/", logger, memeRouter);
app.use(errorHandlerMiddleware);
app.get("/", (req, res) => {
  console.log("Heelo");
  res.status(StatusCodes.OK).json({
    root: "Helel",
  });
});
app.listen(PORT, () => {
  console.log(`Server is running on ${env.SERVER_URL}:${PORT}`);
});
