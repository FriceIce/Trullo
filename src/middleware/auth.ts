import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export default function auth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const jwt_secret = process.env.JWT_SECRET;

  if (!token) {
    return res
      .sendStatus(401)
      .json({ status: 401, message: "No JWT token provided." }); // Unauthorized
  }

  if (!jwt_secret) {
    throw new Error("Missing JWT_SECRET in environment");
  }

  jwt.verify(token, jwt_secret, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ status: 403, message: "Failed to verify the JWT token." }); // Forbidden
    }

    req.user = user as JwtPayload;
    next();
  });
}
