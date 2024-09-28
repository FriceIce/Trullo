import express from "express";
import {
  createTask,
  deleteTask,
  editTask,
  getTask,
  getTasks,
} from "./task.controller.ts";

const router = express.Router();

router.post("/task", createTask);
router.get("/task/:id", getTask);
router.get("/tasks", getTasks);
router.put("/task/:id", editTask);
router.delete("/task/:id", deleteTask);

export default router;
