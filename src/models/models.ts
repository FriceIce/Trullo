import { Model, Schema, model } from "mongoose";
import { ITask, IUser } from "../types.ts";

const userSchema = new Schema<IUser, Model<IUser>>({
  id: String,
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const taskSchema = new Schema<ITask, Model<ITask>>({
  id: String,
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "to-do", required: true },
  assignedTo: [String],
  createdAt: { type: Date, default: Date.now() },
  finishedBy: { type: String, default: "Not finished." },
});

const User = model<IUser>("User", userSchema);
const Task = model<ITask>("Task", taskSchema);

export { User, Task };
