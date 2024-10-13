import { Router } from "express";
import { authorization } from "../middlewares/authorization";
import { productController } from "../controllers/product.controller";
import { uploadImage } from "../utils/upload";
export const productRouter = Router();

productRouter.post("/add-new", [
  authorization,
  uploadImage.single("image"),
  productController.addNewProduct,
]);
productRouter.patch("/modify-product/:id", [
  authorization,
  uploadImage.single("image"),
  productController.updateProduct,
]);
productRouter.get("/", productController.getAllProducts);
