import express from "express";
import cors from "cors";
import { userRouter } from "../routes/user.router";
import { productRouter } from "../routes/product.router";
import { purchaseRouter } from "../routes/purchase.router";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/products", productRouter);
app.use("/purchase", purchaseRouter);
