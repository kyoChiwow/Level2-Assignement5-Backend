import httpStatus from 'http-status-codes';
import bcryptjs from 'bcryptjs';
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { envVars } from '../../config/env';
import { User } from './user.model';
import { JwtPayload } from 'jsonwebtoken';

const createUserService = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exist");
  }

  const hashedPassword = bcryptjs.hashSync(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  /**
   * email - can not update
   * name, phone, password address
   * password - re hashing
   *  only admin superadmin - role, isDeleted...
   *
   * promoting to superadmin - superadmin
   */

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not allowed to update role!"
      );
    }
    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND);
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });

  return newUpdatedUser;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

export const UserService = {
  createUserService,
  updateUser,
  getAllUsers
};
