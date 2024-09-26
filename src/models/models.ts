import { Model, Schema, model } from "mongoose";
import { ITask, IUser } from "../types.ts";

const userSchema = new Schema<IUser, Model<IUser>>({
  id: String,
  name: String,
  email: String,
  password: String,
});

const taskSchema = new Schema<ITask, Model<ITask>>({
  id: String,
  title: String,
  description: String,
  status: { type: String, default: "to-do" },
  assignedTo: [String],
  createdAt: Date,
  finishedBy: String,
});

const User = model<IUser>("User", userSchema);
const Task = model<ITask>("Task", taskSchema);

export { User, Task };
