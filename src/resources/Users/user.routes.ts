import express from "express";
import {
  deleteUser,
  getUsers,
  logInUser,
  registerUser,
  updateUser,
} from "./user.controller.ts";

const router = express.Router();

router.post("/registerUser", registerUser);
router.post("/logInUser/", logInUser);
router.get("/getUsers/", getUsers);
router.delete("/deleteUser/:id", deleteUser);
router.put("/updateUser/:id", updateUser);

export default router;
