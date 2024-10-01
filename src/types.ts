import { Schema, Types } from "mongoose";

export interface IUser {
  username: string;
  email: string; // uniqe
  password: string;
  secretKey: string;
  role: "admin" | "user";
  projects?: Types.ObjectId[];
}

export interface ITask {
  title: string;
  description: string;
  status: "to-do" | "in-progress" | "done" | "blocked";
  assignedTo: string[];
  createdAt: Date;
  finishedBy: "Not finished" | string;
  project: Types.ObjectId;
}

export interface IProject {
  _id: typeof Schema.Types.ObjectId;
  title: String;
  description?: String;
  tasks?: Types.ObjectId[];
  members?: Types.ObjectId[];
  status: "active" | "inactive" | "done";
  createdBy: Types.ObjectId;
  createdAt: Date;
}
