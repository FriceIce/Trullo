import { Request, Response } from "express";
import { Task } from "../../models/models.ts";
import { ITask, IUser } from "../../types.ts";
import validateRequestBody from "../../modules/validateReqBody.ts";

/**  
  @description - Create a new task
  @route - POST /createTask/
*/

export const createTask = async (req: Request, res: Response) => {
  const body: ITask = req.body;
  const { title, description } = body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ status: 400, message: "Title and description are required" });
  }

  try {
    return await Task.create<ITask>(body)
      .then((data) => {
        return res.status(200).json({
          status: 200,
          message: "Task was created successully",
          data: data,
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
      });
  } catch (error) {}
};

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

/** 
  @description - get all tasks
  @routes - GET /tasks
*/

export const getTasks = async (req: Request, res: Response) => {
  try {
    const task = await Task.find();

    if (!task) {
      return res.status(404).json({ status: 404, message: "Tasks not found." });
    }

    return res.status(200).json({ status: 200, data: task });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/** 
  @description - Edit task
  @route - PUT /task/:id
*/

export const editTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status, assignedTo, ...rest } = req.body as ITask; // ...rest is where we get all the bad keys.

  const isNotValid = validateRequestBody(
    res,
    ["title", "description", "status", "assignedto"],
    rest
  );

  if (isNotValid) return isNotValid;

  try {
    const task = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        status,
        assignedTo,
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ status: 404, message: "Task not found." });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Task updated successfully", data: task });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**  
  @description - Remove task
  @route - DELETE /task/:id
*/

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ status: 404, message: "Task not found." });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
