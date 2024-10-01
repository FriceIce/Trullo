import express from "express";
import { connectDB } from "./connect.ts";
import "dotenv/config";

// routes
import taskRouter from "./resources/Tasks/task.routes.ts";
import userRouter from "./resources/Users/user.routes.ts";
import projectRouter from "./resources/Projects/projects.routes.ts";

connectDB();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// routes
app.use("/api", taskRouter);
app.use("/api", userRouter);
app.use("/api", projectRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
