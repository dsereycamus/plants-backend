import { Request, Response } from "express";
import { User } from "../types/schemas";
import { comparePassword, encryptPassword } from "../utils/encrypter";
import { sign } from "../utils/jwt";

export const userController = {
  getUserInfo: async (req: Request, res: Response): Promise<void> => {
    try {
      const { user } = req;

      res.status(200).send({
        message: "Se pudo conseguir la información del usuario",
        data: user,
      });
      return;
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Ocurrió un error al intentar conseguir la información",
        error: e,
      });
    }
  },
  signin: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(404).send({ message: "No existe el usuario" });
        return;
      }
      const verifyPassword = await comparePassword(password, user!.password);
      if (!verifyPassword) {
        res.status(401).send({ message: "La contraseña es incorrecta" });
        return;
      }
      const token = sign(user.id, email);
      res
        .status(200)
        .send({ message: "Has iniciado sesión con éxito.", token });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Ocurrió un error al intentar iniciar sesión",
        error: e,
      });
    }
  },
  signup: async (req: Request, res: Response): Promise<void> => {
    try {
      const { names, lastNames, email, password } = req.body;
      if (!names || !lastNames || !email || !password) {
        res
          .status(400)
          .send({ message: "Debes rellenar todos los campos." });
        return;
      }
      const checkUser = await User.findOne({ where: { email } });
      if (checkUser) {
        res
          .status(401)
          .send({ message: "Ya existe un usuario con ese correo." });
        return;
      }
      const encryptedPassword = await encryptPassword(password);
      const user = await User.create({
        names,
        lastNames,
        email,
        password: encryptedPassword,
      });
      const token = sign(user.id, email);
      res
        .status(200)
        .send({ message: "Has creado tu usuario con éxito.", token });
      return;
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Ocurrió un error al intentar registrarse",
        error: e,
      });
    }
  },
};
