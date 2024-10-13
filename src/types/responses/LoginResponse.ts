import { User } from "../schemas";

export type TLoginResponse = {
  accessToken: string;
  userData: User;
};
