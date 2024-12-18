import { Request, Response } from "express";
import { UserModel } from "../models/User";
import { generateToken, verifyToken } from "../utils/jwt";
import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} from "../exceptions/errors";
import mongoose from "mongoose";
import { ROLES } from "../constants/userRoles";

export const register = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password, phone_number, role } =
      req.body;

    if (role === ROLES.ADMIN) {
      const existingAdmin = await UserModel.findOne({ role: ROLES.ADMIN });

      if (existingAdmin) {
        return res.status(409).json({
          message: "Admin already exists",
          user: existingAdmin,
        });
      }
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        user: existingUser,
      });
    }

    const userToSave = new UserModel({
      first_name,
      last_name,
      email,
      password,
      phone_number,
      role,
    });
    const savedUser = await userToSave.save();

    const token = generateToken(savedUser);

    return res.status(201).json({
      message: "Registration successfully done!",
      user: savedUser,
      token,
    });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.status(400).json({
        message: error.message,
      });
    } else if (error instanceof NotFoundError) {
      return res.status(404).json({
        message: error.message,
      });
    } else if (error instanceof Error) {
      return res.status(500).json({
        message: error.message,
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: validationErrors[0],
      });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userToLogIn = await UserModel.findOne({ email });

    if (!userToLogIn) {
      throw new NotFoundError("User not found");
    } else if (!(await userToLogIn.comparePassword(password))) {
      throw new BadRequestError("Invalid Password");
    }

    const token = generateToken(userToLogIn);

    return res.status(200).json({
      message: `Welcome back ${userToLogIn?.role === ROLES.ADMIN ? userToLogIn?.role :""}`,
      user: userToLogIn,
      token,
    });
  } catch (error) {
    if (error instanceof BadRequestError) {
      return res.status(400).json({
        message: error.message,
      });
    } else if (error instanceof NotFoundError) {
      return res.status(404).json({
        message: error.message,
      });
    } else if (error instanceof Error) {
      return res.status(500).json({
        message: error.message,
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: validationErrors[0],
      });
    }
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json({
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: error.message,
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: validationErrors[0],
      });
    }
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    const user = await UserModel.findById(user_id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: error.message,
      });
    } else if (error instanceof NotFoundError) {
      return res.status(404).json({
        message: error.message,
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: validationErrors[0],
      });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const deletedUser = await UserModel.findByIdAndDelete(user_id);
    if (!deleteUser) {
      throw new NotFoundError("User to delete not found");
    }

    return res.status(204).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: error.message,
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: validationErrors[0],
      });
    }
  }
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  try {
    const deletedUsers = await UserModel.deleteMany();
    if (deletedUsers.deletedCount == 0) {
      return res.status(404).json({
        message: "There were no users to delete",
        deletedUsers: deletedUsers.deletedCount,
      });
    }
    return res.status(204).json({
      message: "All users deleted successfully",
      deletedUsers: deletedUsers.deletedCount,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: error.message,
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: validationErrors[0],
      });
    }
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization")?.substring(7);
    const decodedToken = verifyToken(token!);
    //@ts-ignore
    const user = decodedToken?.decodedUser?.user;
    const currentUser = await UserModel.findOne({ ...user });

    if (!currentUser) {
      return res.status(401).json({
        message: "Invalid token, no user found",
      });
    }

    return res.status(200).json({
      message: "Fetched current user successfully ",
      currentUser,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({
        message: error.message,
      });
    } else if (error instanceof UnAuthorizedError) {
      return res.status(401).json({
        message: error.message,
      });
    } else if (error instanceof Error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
};
