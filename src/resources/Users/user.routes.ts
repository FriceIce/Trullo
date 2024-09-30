import express from "express";
import auth from "../../middleware/auth.ts";

import {
  paramValidator,
  registerBodyValidation,
  resetPasswordValidatior,
} from "../../modules/express_validator.ts";
import {
  deleteUser,
  getUsers,
  logInUser,
  registerUser,
  resetPassword,
  updateUser,
} from "./user.controller.ts";
import authAdmin from "../../middleware/authAdmin.ts";

const router = express.Router();

router.post("/registerUser", registerBodyValidation(), registerUser, logInUser);
router.post("/logInUser/", logInUser);
router.get("/getUsers/", getUsers);
router.delete("/deleteUser/:id", auth, paramValidator(), deleteUser);
router.put("/updateUser/:id", auth, authAdmin, paramValidator(), updateUser);
router.put(
  "/resetPassword/:id",
  auth,
  resetPasswordValidatior(),
  resetPassword
);

export default router;
