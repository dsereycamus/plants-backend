import { StatusCodes } from "http-status-codes";

export type TGenericAPIResponse<T> = {
  message: string;
  statusCode: StatusCodes;
  data: T;
  error?: string;
};
