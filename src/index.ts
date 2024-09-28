import express from "express";
import { connectDB } from "./connect.ts";
import "dotenv";

// routes
import taskRouter from "./resources/Tasks/task.routes.ts";
import userRouter from "./resources/Users/user.routes.ts";

connectDB();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// routes
app.use("/api", taskRouter);
app.use("/api", userRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
