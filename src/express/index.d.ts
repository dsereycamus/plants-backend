import express from "express";
import { User } from "../schemas";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
