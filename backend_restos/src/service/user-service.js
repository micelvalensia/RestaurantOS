import { prismaClient } from "../application/database.js";
import { generateAuthToken } from "../middleware/auth.js";
import AppError from "../middleware/errorHandler.js";
import bcrypt from "bcrypt";

const registerUser = async (request) => {
  const { username, email, password, roleId } = request;

  const existingUser = await prismaClient.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    throw new AppError("Username or email already exists", 400);
  }

  const isRoleValid = await prismaClient.role.findUnique({
    where: { id: roleId },
  });

  if (!isRoleValid) {
    throw new AppError("Invalid role ID", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prismaClient.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      roleId,
    },
  });

  return { username: newUser.username };
};

const loginUser = async (request) => {
  const { username, password } = request;

  const user = await prismaClient.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new AppError("Invalid username or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid username or password", 401);
  }

  const token = generateAuthToken(user);

  return token;
};

export default {
  registerUser,
  loginUser,
};
