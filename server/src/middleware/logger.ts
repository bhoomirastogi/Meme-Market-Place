import type {
  Response,
  Request,
  NextFunction,
  ErrorRequestHandler,
} from "express";

export const logger = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`${req.path}/${req.method}`);

  next();
};
