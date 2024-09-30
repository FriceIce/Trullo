import { Response } from "express";

const generalCatchErrorMsg = (res: Response, error: unknown) => {
  console.log(error);
  return res.status(500).json({ status: 500, message: "Server error." });
};

export default generalCatchErrorMsg;
