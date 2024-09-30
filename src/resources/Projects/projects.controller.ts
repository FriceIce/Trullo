import { Request, Response } from "express";
import { Types } from "mongoose";
import { Project } from "../../models/models.ts";
import { IProject } from "../../types.ts";
import generalCatchErrorMsg from "../../modules/basicErrorMsg.ts";

/** 
  @description - Create a new project (Trullo board).The body must include the title during creation, while the description and members fields are optional. 
  @route - POST /api/createProject/:id 
*/

export const createProject = async (req: Request, res: Response) => {
  const id = new Types.ObjectId(req.params.id);
  const body: IProject = req.body;
  const { title, members } = body;

  // if the members list includes owner remove it before adding it to avoid duplication
  const filteredMembersList = members
    ? members.filter((member) => member !== id)
    : [];
  filteredMembersList.push(id);

  if (!title) {
    return res.status(400).json({ message: "Title is required." });
  }

  try {
    const project = await Project.create<IProject>({
      ...body,
      createdBy: id,
      members: filteredMembersList,
    });

    console.log(project);

    if (!project) {
      return res
        .status(500)
        .json({ status: 500, message: "Unable to create the project." });
    }

    return res.status(200).json({
      status: 200,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error.", error });
  }
};

/** 
  @description - update member for project. The body must contain a property named member with a valid user ID and action property with delete or add. 
  @route - POST /api/updateMembersforProject/:id 
*/

export const updateMember = async (req: Request, res: Response) => {
  const { id } = req.params; // project id
  const body: { member: string; action: "delete" | "add" } = req.body;
  const member = new Types.ObjectId(body.member);
  const { action } = body;

  if (!member) {
    return res.status(400).json({ message: "Members list is required." });
  }

  if (action !== "add" && action !== "delete") {
    return res
      .status(400)
      .json({ message: "Invalid action. Use 'add' or 'delete'." });
  }

  const push_Or_pull =
    action === "add"
      ? { $push: { members: member } }
      : { $pull: { members: member } };

  try {
    const project = await Project.findByIdAndUpdate(id, push_Or_pull, {
      new: true,
    });

    if (!project) {
      return res.status(500).json({
        status: 500,
        message: "Unable to update members for the project.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Members updated successfully",
      data: project,
    });
  } catch (error) {
    generalCatchErrorMsg(res, error);
  }
};

/** 
  @description - update project status. The body must contain a property named status with a valid status (active/inactive). 
  @route - PUT /api/updateProjectStatus/:id 
*/

export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params; // project id
  const body: { status: "active" | "inactive" | "done" } = req.body;
  const { status } = body;

  const allowedStatuses = ["active", "inactive", "done"];
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Valid status is required." });
  }

  try {
    const project = await Project.findByIdAndUpdate(
      id,
      { status: status.toLocaleLowerCase() },
      { new: true }
    );

    if (!project) {
      return res.status(500).json({
        status: 500,
        message: "Unable to update project status.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Project status updated successfully",
      data: project,
    });
  } catch (error) {
    generalCatchErrorMsg(res, error);
  }
};

/** 
  @description - Delete project. 
  @route - DELETE /api/deleteProject/:id 
*/

export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params; // project id

  try {
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(400).json({
        status: 400,
        message: "The project referenced in the parameters was not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Project deleted successfully",
    });
  } catch (error) {
    generalCatchErrorMsg(res, error);
  }
};

/** 
  @description - Fetch specific project. Parameter must contain project id.
  @route - GET /api/fetchProject/:id
*/
export const getProject = async (req: Request, res: Response) => {
  const { id } = req.params; // project id

  try {
    const project = await Project.findById(id).populate([
      {
        path: "tasks",
      },
      {
        path: "members",
        select: "username",
      },
    ]);

    if (!project) {
      return res.status(400).json({
        status: 400,
        message: "The project referenced in the parameters was not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    generalCatchErrorMsg(res, error);
  }
};
