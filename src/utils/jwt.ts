import { config } from "dotenv";
import jwt from "jsonwebtoken";
import path from "path";
config({
  path: path.join(__dirname, "../../.env"),
});

const secret = process.env.JWT_SECRET ?? "";

export const sign = (id: string, email: string) => {
  return jwt.sign({ id, email }, secret, { expiresIn: "1d" });
};

export const verify = (token: string) => {
  return jwt.verify(token, secret);
};
