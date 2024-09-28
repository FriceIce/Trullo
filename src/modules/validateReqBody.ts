import { Response } from "express";

const validateRequestBody = (
  res: Response,
  allowedKeys: string[],
  rest: Record<string, unknown>
) => {
  const imposterKeys = Object.keys(rest).filter(
    (key) => !allowedKeys.includes(key.toLowerCase())
  );

  if (imposterKeys.length > 0) {
    return res
      .status(400)
      .json({ error: `Invalid properties: ${imposterKeys.join(", ")}` });
  }

  return null;
};

export default validateRequestBody;
