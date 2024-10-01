import { Request, Response } from "express";
import { Types } from "mongoose";
import catchErrorMsg from "../../Error/basicErrorMsg.ts";
import { AuthenticatedRequest } from "../../middleware/auth.ts";
import { Project, User } from "../../models/models.ts";
import { IProject } from "../../types.ts";

/** 
  @description - Create a new project (Trullo board).The body must include the title during creation, while the description and members fields are optional. 
  @route - POST /api/createProject/:id 
*/

export const createProject = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) return null;

  const id = new Types.ObjectId(req.user.id); // user id
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

    filteredMembersList.forEach(async (memberId) => {
      const user = await User.findByIdAndUpdate(memberId, {
        $push: { projects: project._id },
      });

      if (!user) {
        return res.status(500).json({
          status: 500,
          message: "Unable to update projects property in user for " + memberId,
        });
      }
    });

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
  @description - Update a member for a project. The request body must contain a member property with a valid user ID and an action property with either the value delete or add to specify how the function should handle the member input. 
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
      return res.status(404).json({
        status: 404,
        message: "The project referenced in the parameters was not found.",
      });
    }

    if (action == "add") {
      const user = await User.findByIdAndUpdate(
        member,
        { $push: { projects: id } },
        { new: true }
      );

      if (!user) {
        return res.status(500).json({
          message: "Unable to update member in this project: " + project?.id,
        });
      }
    }

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
    catchErrorMsg(res, error);
  }
};

/** 
  @description - Update project status. The request body must contain a status property with a valid status (active or inactive), and the parameters must include the project ID.
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
      return res.status(404).json({
        status: 404,
        message: "The project referenced in the parameters was not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Project status updated successfully",
      data: project,
    });
  } catch (error) {
    catchErrorMsg(res, error);
  }
};

/** 
  @description - Delete project. Only the owner can delete the project. The project ID must be specified in the parameters.
  @route - DELETE /api/deleteProject/:id 
*/

export const deleteProject = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) return null;
  const id = req.params.id; // project id
  const userID: string = req.user.id; // user id

  try {
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        status: 404,
        message: "The project referenced in the parameters was not found.",
      });
    }

    if (userID !== String(project.createdBy)) {
      return res.status(401).json({
        status: 401,
        message:
          "You are not authorized to delete this project. Only the owner can delete this project.",
      });
    }

    if (project.members) {
      project.members.forEach(async (memberId) => {
        const user = await User.findByIdAndUpdate(memberId, {
          $pull: { projects: memberId },
        });

        if (!user) {
          return res.status(500).json({
            message:
              "Unable to update projects property in user for " + memberId,
          });
        }
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Project deleted successfully",
    });
  } catch (error: unknown) {
    catchErrorMsg(res, error);
  }
};

/** 
  @description - Fetch a specific project. The parameter must include the project ID you wish to retrieve.
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
      return res.status(404).json({
        status: 404,
        message: "The project referenced in the parameters was not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    catchErrorMsg(res, error);
  }
};
