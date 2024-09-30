import { Response, Request, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.ts";

const authAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next(); // If the user has access, continue to the main function.
};

export default authAdmin;
