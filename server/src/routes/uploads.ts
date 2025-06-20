import { Router } from "express";
import {
  uploadImageMiddleware,
  uploadImageToSupabase,
} from "./../controllers/uploads";

export const uploadsRouter = Router();

uploadsRouter.post("/upload", uploadImageMiddleware, uploadImageToSupabase);
