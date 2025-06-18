import express, { Request, Response } from "express";
import router from "./routes/memes";

const app = express();
const PORT = 8080;

app.use("/memes", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
