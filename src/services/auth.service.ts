import {
  AuthResponse,
  BadRequestError,
  LoginRequest,
  SignupRequest,
  User,
  UserAuth,
} from "../interfaces";
import { UserDb, UserAuthDb, UserTokenDb } from "../models";
import bcrypt from "bcrypt";
import { config } from "../constants/settings";
import * as notificationService from "./notification.service";
import { JwtHelper } from "../helpers/jwt/jwt.helper";

const jwtHelper = new JwtHelper({
  privateKey: config.jwtPrivateKey,
  UserTokenDb,
});

export async function signup(payload: SignupRequest): Promise<AuthResponse> {
  const {
    fullName,
    regNo,
    dateOfBirth,
    department,
    level,
    password,
    expoToken,
  } = payload;

  const email = payload.email.toLowerCase();

  const existingUser = await UserDb.findOne<User>({ email });
  if (existingUser) {
    throw new BadRequestError("user already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await UserDb.create({
    email,
    fullName,
    regNo,
    dateOfBirth,
    department,
    level,
  });

  if (expoToken) {
    await notificationService.saveExpoTokens(user.id, expoToken);
  }

  await UserAuthDb.create({
    email,
    password: hashedPassword,
    user: user.id,
    expoToken: expoToken,
  });

  const token = jwtHelper.generateToken({
    email,
    userId: user.id,
  });

  await UserTokenDb.create({
    email,
    token,
    user: user.id,
  });

  return {
    user: user as unknown as User,
    token: token,
  };
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const email = payload.email.toLowerCase();
  const { password } = payload;

  const user = await UserAuthDb.findOne<UserAuth>({ email });
  if (!user) {
    throw new BadRequestError("invalid credentials");
  }

  const verifyPassword = await bcrypt.compare(password, user.password);
  if (!verifyPassword) {
    throw new BadRequestError("invalid credentials");
  }

  const token = jwtHelper.generateToken({
    email,
    userId: user.user,
  });

  await UserTokenDb.updateOne(
    {
      email: email,
    },
    {
      token,
      email,
      user: user.id,
    }
  );
  return {
    user: user as unknown as User,
    token: token,
  };
}
