import express from "express";
import auth from "../../middleware/auth.ts";
import authAdmin from "../../middleware/authAdmin.ts";
import {
  paramValidator,
  registerBodyValidation,
} from "../../modules/express_validator.ts";
import {
  deleteCurrentUser,
  getUser,
  logInUser,
  registerUser,
  resetPassword,
  updateUser,
} from "./user.controller.ts";

const router = express.Router();

router.post("/registerUser", registerBodyValidation(), registerUser, logInUser);
router.post("/logInUser/", logInUser);
router.get("/currentUser/", auth, getUser);
router.delete("/deleteCurrentUser/", auth, deleteCurrentUser);
router.put("/updateUser/:id", auth, authAdmin, paramValidator(), updateUser); // ONLY FOR ADMINS
router.put("/resetPassword/", auth, resetPassword);

export default router;
