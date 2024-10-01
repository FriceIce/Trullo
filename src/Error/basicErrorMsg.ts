import { Response } from "express";
import jwt from "jsonwebtoken";
import { MongooseError } from "mongoose";

const catchErrorMsg = (res: Response, error: unknown) => {
  if (error instanceof MongooseError) {
    // mongoose error
    if (error.name === "CastError") {
      return res.status(400).json({
        status: 400,
        message:
          "Invalid project ID format. Input must be a 24 character hex string, 12 byte Uint8Array, or an integer",
      });
    }

    // error with finishing the MongoDB operation.
    if (error.name === "ValidationError") {
      return res.status(500).json({ status: 500, message: error.message });
    }
  }

  if (error instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (error instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      message: "Token has expired",
      expiredAt: error.expiredAt,
    });
  }

  // syntax error
  console.log(error);
  return res.status(500).json({ status: 500, message: "Server error." });
};

export default catchErrorMsg;
