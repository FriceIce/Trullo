import bcrypt from "bcrypt";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../../models/models.ts";
import validateRequestBody from "../../modules/validateReqBody.ts";
import { IUser } from "../../types.ts";
import generalCatchErrorMsg from "../../modules/basicErrorMsg.ts";

/** 
  @description - create user
  @route - POST /api/registerUser/
*/

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body: IUser = req.body;
  console.log(req.body);
  const { username, email, password, secretKey } = body;

  // epxress validator
  const result = validationResult(body);

  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });

  try {
    const saltRounds = 10;

    // If bcrypt.hash throws an error, try catch will "catch" it and return error message
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const hashedSecretKey = await bcrypt.hash(secretKey, saltRounds);

    const createUser = await User.create({
      username: username.toLocaleLowerCase(),
      email: email.toLocaleLowerCase(),
      password: hashedPassword,
      secretKey: hashedSecretKey,
    });

    if (!createUser) {
      return res
        .status(500)
        .json({ status: 500, message: "Unable to create user." });
    }

    console.log("User created successfully");
    next(); // next ---> logInUser
  } catch (error) {
    generalCatchErrorMsg(res, error);
  }
};

/** 
  @description get specific user/users --> output: [user1, user2, user3]
  @route - POST /api/getUsers/
*/

export const getUsers = async (req: Request, res: Response) => {
  const { ids } = req.body;
  console.log(req.body);
  if (!ids) {
    return res.status(400).json({ message: "IDs are required" });
  }

  try {
    const users = await User.find({ _id: { $in: ids } });

    return res.status(200).json({
      status: 200,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    generalCatchErrorMsg(res, error);
  }
};

/** 
  @description - log in user
  @route - POST /api/logInUser/
*/

export const logInUser = async (req: Request, res: Response) => {
  const token_secret = process.env.JWT_SECRET;
  const body: IUser = req.body;
  const { username, email, password } = body; // If the username is defined, it means that the code came from the register function.

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLocaleLowerCase() });

    if (!user)
      return res
        .status(400)
        .json({ message: "There is no user with this email." });

    const isCorrectPassword = await bcrypt.compare(password, user.password); // boolean

    if (!isCorrectPassword)
      return res
        .status(400)
        .json({ status: 400, message: "Incorrect password." });

    if (!token_secret)
      return res
        .status(500)
        .json({ status: 500, message: "Unable to create token" });

    // Initialize token and give the jwt token a role.
    const token = jwt.sign({ id: user.id, role: user.role }, token_secret, {
      expiresIn: "1h",
    });
    const responseData = {
      username: user.username,
      email: user.email,
      role: user.role,
      access_token: token,
    };

    return res.status(200).json({
      status: 200,
      message: username
        ? "The user has been successfully registered and logged in"
        : "user logged in successfully.",
      data: responseData,
    });
  } catch (error) {
    generalCatchErrorMsg(res, error);
  }
};

/** 
  @description delete user
  @route - delete /api/deleteUser/:id
*/

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user)
      return res.status(400).json({
        status: 400,
        message: "Bad request. There is no user with id: " + id,
      });

    return res
      .status(200)
      .json({ status: 200, message: "User deleted successfully" });
  } catch (error) {
    generalCatchErrorMsg(res, error);
  }
};

/** 
  @description - update user information. This route is ONLY for admins. 
  @route - PUT /api/updateUser/:id
*/

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const body: IUser = req.body;
  const { username, email, password, role, ...rest } = body;

  const bodyIsNotValid = validateRequestBody(
    res,
    ["username", "email", "password", "role"],
    rest
  );

  if (bodyIsNotValid) return bodyIsNotValid;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(500)
        .json({ status: 500, message: "Server side error" });
    }

    //update user.
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        username: username ? username.toLowerCase() : user.username,
        email: email ? email.toLocaleLowerCase() : user.email,
        role: role ? role.toLocaleLowerCase() : user.role,
      },
      { new: true }
    );

    if (!updateUser)
      return res.status(400).json({
        status: 400,
        message: "Bad request. There is no user with id: " + id,
      });

    return res
      .status(200)
      .json({
        status: 200,
        message: "User updated successfully",
        data: {
          username: updateUser.username,
          email: updateUser.email,
          role: updateUser.role,
        },
      })
      .status(200)
      .json({ status: 200, message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: "Server side error" });
  }
};

/** 
  @description - This route is used for password reset and requires the secret key to match the user's secret key for the process to complete successfully. 
  @route PUT - /api/resetPassword/:id
*/

export const resetPassword = async (req: Request, res: Response) => {
  const body: { newPassword: string; secretKey: string } = req.body;
  const { newPassword, secretKey } = body;
  const { id } = req.params;

  const result = validationResult(body);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "Bad request, there is no user with id " + id,
      });
    }

    const unHashSecretKey = await bcrypt.compare(secretKey, user.secretKey);

    if (!unHashSecretKey) {
      return res.status(400).json({
        status: 400,
        message: "Bad request, secret key does not match.",
      });
    }

    // hashing new password if secret key match
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updateUserPassword = await User.findByIdAndUpdate(id, {
      password: hashedPassword,
    });

    if (!updateUserPassword) {
      return res
        .status(500)
        .json({ status: 500, message: "Unable to update user password" });
    }

    // If password updated successfully
    return res
      .status(200)
      .json({ status: 200, message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Server side error.", error });
  }
};
