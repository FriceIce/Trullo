import { Request, Response } from "express";
import { Task } from "../../models/models.ts";

/**  
  @description - get task
  @route - GET /tasks/:id
*/

export const getTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ status: 404, message: "Task not found." });
    }

    return res.status(200).json({ status: 200, data: task });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ status: 404, message: "Task not found." });
    }

    return res.status(200).json({ status: 200, data: task });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
