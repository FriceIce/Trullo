import express from "express";
import { getTask } from "./task.controller.ts";

const router = express.Router();

router.get("/task/:id", getTask);

export default router;
