import express from "express";
import "dotenv";
import taskRouter from "./resources/Tasks/task.routes.ts";
import { connectDB } from "./connect.ts";

connectDB();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// routes
app.use("/api", taskRouter);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
