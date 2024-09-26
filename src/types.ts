export interface IUser {
  id: string;
  name: string;
  email: string; // uniqe
  password: string;
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: "to-do" | "in-progress" | "done" | "blocked";
  assignedTo: string[];
  createdAt: Date;
  finishedBy: string;
}
