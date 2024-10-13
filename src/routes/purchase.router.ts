import { Router } from "express";
import { purchaseController } from "../controllers/purchase.controller";
export const purchaseRouter = Router();

purchaseRouter.post("/", purchaseController.makePurchase);
purchaseRouter.get("/:email", purchaseController.getPurchaseHistory);
