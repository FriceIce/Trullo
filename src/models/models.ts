import { Model, Schema, model } from "mongoose";
import { IProject, ITask, IUser } from "../types.ts";

const userSchema = new Schema<IUser, Model<IUser>>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  secretKey: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

const taskSchema = new Schema<ITask, Model<ITask>>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["to-do", "in-progress", "done", "blocked"],
    default: "to-do",
  },
  assignedTo: [String],
  createdAt: { type: Date, default: Date.now },
  finishedBy: { type: String, default: "Not finished." },
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
});

const preojectSchema = new Schema<IProject, Model<IProject>>({
  // _id: Schema.Types.ObjectId,
  title: { type: String, required: true },
  description: { type: String },
  tasks: { type: [Schema.Types.ObjectId], ref: "Task", default: [] },
  members: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  createdBy: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["active", "inactive", "done"],
    default: "active",
  },
});

const User = model<IUser>("User", userSchema);
const Task = model<ITask>("Task", taskSchema);
const Project = model<IProject>("Project", preojectSchema);

export { User, Task, Project };
