import { Request, Response } from "express";
import { User } from "../../models/models.ts";
import { IUser } from "../../types.ts";
import bcrypt from "bcrypt";
import validateRequestBody from "../../modules/validateReqBody.ts";

/** 
  @description - create user
  @route - POST /registerUser/
*/

export const registerUser = async (req: Request, res: Response) => {
  const body: IUser = req.body;
  console.log(req.body);
  const { username, email, password } = body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (!hashedPassword)
      return res.status(500).json({ message: "Unable to hash password" });

    await User.create({
      username: username.toLocaleLowerCase(),
      email: email.toLocaleLowerCase(),
      password: hashedPassword,
    })
      .then((user) => {
        return res.status(200).json({
          status: 200,
          message: "User created successfully",
          data: user,
        });
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ status: 500, message: "Unable to create user." });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Server side error" });
  }
};

/** 
  @description get specific user/users --> output: [user1, user2, user3]
  @route - POST /getUsers/
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
    console.log(error);
    res.status(500).json({ status: 500, message: "Server side error" });
  }
};

/** 
  @description - log in user
  @route - POST /logInUser/
*/

export const logInUser = async (req: Request, res: Response) => {
  const body: IUser = req.body;
  const { email, password } = body;

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
      return res.status(400).json({ message: "Incorrect password." });

    return res.status(200).json({
      status: 200,
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Server side error" });
  }
};

/** 
  @description delete user
  @route - delete /deleteUser/:id
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
    console.log(error);
    res.status(500).json({ status: 500, message: "Server side error" });
  }
};

/** 
  @description - update user information
  @route - PUT / updateUser/:id
*/

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const body: IUser = req.body;
  const { username, email, password, ...rest } = body;

  const bodyIsNotValid = validateRequestBody(
    res,
    ["username", "email", "password"],
    rest
  );

  if (bodyIsNotValid) return bodyIsNotValid;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password ?? "", saltRounds);

    const user = await User.findByIdAndUpdate(
      id,
      {
        username: username.toLowerCase(),
        email: email.toLocaleLowerCase(),
        password: password ? hashedPassword : undefined,
      },
      { new: true }
    );

    if (!user)
      return res.status(400).json({
        status: 400,
        message: "Bad request. There is no user with id: " + id,
      });

    return res
      .status(200)
      .json({ status: 200, message: "User updated successfully", data: user })
      .status(200)
      .json({ status: 200, message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: "Server side error" });
  }
};
