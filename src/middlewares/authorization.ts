import { NextFunction, Request, Response } from "express";
import { verify } from "../utils/jwt";
import { TTokenPayload } from "../typelist/generic/token";
import { User } from "../typelist/schemas";

export const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization;
  if (!token) {
    res
      .status(401)
      .send({ message: "Debes ingresar un token de autorización" });
    return;
  } else {
    const payload: TTokenPayload = verify(
      token.replace("Bearer ", "")
    ) as TTokenPayload;
    const foundUser = await User.findByPk(payload.id);
    if (!foundUser) {
      res
        .status(404)
        .send({ message: "No existe el usuario asignado a este token" });
      return;
    }
    req.user = foundUser!;
    next();
  }
};
