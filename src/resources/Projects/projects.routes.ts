import express from "express";
import auth from "../../middleware/auth.ts";
import {
  updateMember,
  createProject,
  updateStatus,
  deleteProject,
  getProject,
} from "./projects.controller.ts";
import { paramValidator } from "../../modules/express_validator.ts";

const router = express.Router();

router.get("/fetchProject/:id", auth, paramValidator(), getProject);
router.post("/createProject/", auth, createProject);
router.delete("/deleteProject/:id", auth, paramValidator(), deleteProject);
router.put("/updateProjectStatus/:id", auth, paramValidator(), updateStatus);
router.put("/updateMemberForProject/:id", auth, paramValidator(), updateMember);

export default router;
