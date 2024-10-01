import { Response } from "express";

const checkIfExsists = async <T>(
  value: T | null,
  res: Response,
  errorMsg: string
) => {
  const response = await value;
  if (!response) {
    return res.status(404).json({ status: 404, message: errorMsg });
  }

  return true;
};

export default checkIfExsists;
