import { checkSchema, param } from "express-validator";

export const paramValidator = () => param("id").notEmpty().trim();

export const resetPasswordValidatior = () => {
  return checkSchema(
    {
      newPassword: {
        notEmpty: true,
        isEmpty: {
          errorMessage: "New password cannot be empty",
        },
        isLength: {
          options: {
            min: 8,
            max: 30,
          },
          errorMessage: "New password must have at least 8 characters",
        },
      },
      secretKey: {
        notEmpty: true,
        isEmpty: {
          errorMessage: "Secret key cannot be empty",
        },
      },
    },
    ["body"]
  );
};

export const registerBodyValidation = () =>
  checkSchema(
    {
      username: {
        notEmpty: true,
        isEmpty: {
          errorMessage: "Username cannot be empty",
        },
        isLength: {
          options: {
            min: 2,
          },
          errorMessage: "Username must have more than one character",
        },
      },
      email: {
        errorMessage: "Invalid email address",
        notEmpty: true,
        isEmpty: {
          errorMessage: "Email cannot be empty",
        },
        isEmail: true,
      },
      password: {
        notEmpty: true,
        isEmpty: {
          errorMessage: "Password cannot be empty",
        },
        isLength: {
          options: {
            min: 8,
            max: 30,
          },
          errorMessage: "Password must have at least 8 characters",
        },
      },
      secretKey: {
        notEmpty: true,
        isEmpty: {
          errorMessage: "Secret key cannot be empty",
        },
        isLength: {
          options: {
            min: 2,
            max: 10,
          },
          errorMessage: "Secret key must have at least 2 characters",
        },
      },
    },
    ["body"]
  );

export const createProjectBodyValidation = () => {
  return checkSchema(
    {
      title: {
        notEmpty: true,
        isEmpty: {
          errorMessage: "Title cannot be empty",
        },
        isLength: {
          options: {
            min: 2,
          },
          errorMessage: "Title must have more than 2 characters",
        },
      },
    },
    ["body"]
  );
};
