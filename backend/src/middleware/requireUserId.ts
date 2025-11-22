import { Request, Response, NextFunction } from "express";

export const requireUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.method === "GET" ? req.query.userId : req.body?.userId;
  if (!userId || typeof userId !== "string") {
    return res.status(401).json({ message: "User ID is required" });
  }
  next();
};
