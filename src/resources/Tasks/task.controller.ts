import { Request, Response } from "express";
import { Project, Task } from "../../models/models.ts";
import { IProject, ITask } from "../../types.ts";
import validateRequestBody from "../../modules/validateReqBody.ts";
import { Types } from "mongoose";
import catchErrorMsg from "../../Error/basicErrorMsg.ts";

/**  
  @description - Create a new task. Title and description are required in the request body.
  @route - POST /api/createTask/:id
*/

export const createTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const body: ITask = req.body;
  const { title, description } = body;
  console.log(body);

  if (!title || !description) {
    return res
      .status(400)
      .json({ status: 400, message: "Title and description are required" });
  }

  try {
    const task = await Task.create<ITask>({
      ...body,
      project: new Types.ObjectId(id),
    });

    if (!task) {
      return res
        .status(404)
        .json({ status: 404, message: "Unable to create this task." });
    }

    const project = await Project.findByIdAndUpdate<IProject>(
      id,
      { $push: { tasks: task.id } },
      { new: true }
    );

    if (!project) {
      return res.status(500).json({
        message: "The project referenced in the parameters was not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Task was created successully",
      data: task,
    });
  } catch (error) {
    catchErrorMsg(res, error);
  }
};

/**  
  @description - get task by ID. Task ID is needed. 
  @route - GET /api/task/:id
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
    catchErrorMsg(res, error);
  }
};

/** 
  @description - get all tasks in a project. Project ID is needed. 
  @routes - GET /api/tasksInProject/:id
*/

export const getTasks = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const tasks = await Task.find({ project: new Types.ObjectId(id) });

    if (!tasks) {
      return res
        .status(404)
        .json({ status: 404, message: "Tasks not found. Check the ID." });
    }

    return res.status(200).json({ status: 200, data: tasks });
  } catch (error) {
    catchErrorMsg(res, error);
  }
};

/** 
  @description - Edit task. Task ID is needed in the parameter and in the request body --> title, description, status, assignedTo is optional. 
  @route - PUT /api/task/:id
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
      return res.status(404).json({
        status: 404,
        message: "The task referenced in the parameters was not found.",
      });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Task updated successfully", data: task });
  } catch (error) {
    catchErrorMsg(res, error);
  }
};

/**  
  @description - This function will remove the task from the 'task' collection and also delete the task ID from the tasks property of the project that matches the route parameter ID.
  @route - DELETE /deleteTask/:id
*/

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params; // task id
  console.log(id);
  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ status: 404, message: "Task not found." });
    }

    const project = await Project.findByIdAndUpdate(
      task.project,
      { $pull: { tasks: task.id } }, // Removes the taskId from tasks array
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        status: 404,
        message:
          "The project ID referenced to this task is not found. Project ID: " +
          task.project,
      });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Task deleted successfully" });
  } catch (error) {
    catchErrorMsg(res, error);
  }
};
