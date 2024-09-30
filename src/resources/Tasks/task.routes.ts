import express from "express";
import auth from "../../middleware/auth.ts";
import { paramValidator } from "../../modules/express_validator.ts";
import {
  createTask,
  deleteTask,
  editTask,
  getTask,
  getTasks,
} from "./task.controller.ts";

const router = express.Router();

router.post("/createTask/:id", auth, createTask);
router.get("/task/:id", auth, paramValidator(), getTask);
router.get("/getTasksInProject/:id", auth, getTasks);
router.put("/editTask/:id", auth, paramValidator(), editTask);
router.delete("/deleteTask/:id", auth, paramValidator(), deleteTask);

export default router;
