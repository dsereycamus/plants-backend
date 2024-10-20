import { Request, Response } from "express";
import { Product, Purchase } from "../typelist/schemas";

export const purchaseController = {
  getPurchaseHistory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.params;
      if (!email) {
        res.status(400).send({
          message: "Debes ingresar el email del usuario o del comprador",
        });
        return;
      }
      const purchaseList = await Purchase.findAll({
        where: { "buyerData.email": email },
      }).then(
        async (list) =>
          await Promise.all(
            list.map(async (purchase) => ({
              ...purchase.dataValues,
              products: await Promise.all(
                purchase.products.map(async (prod) => ({
                  product: await Product.findByPk(prod.productId),
                  amount: prod.amount,
                }))
              ),
            }))
          )
      );
      res.status(200).send({
        message: "Se pudo conseguir el historial de compras",
        data: purchaseList,
      });
      return;
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Ocurrió un error al intentar conseguir la información",
        error: e,
      });
      return;
    }
  },
  makePurchase: async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        products,
        totalPrice,
        intendedPrice,
        paymentMethod,
        deliveryData,
        buyerData,
      } = req.body;

      if (
        !products ||
        (products && products.length === 0) ||
        !totalPrice ||
        !intendedPrice ||
        !deliveryData ||
        !paymentMethod ||
        !buyerData
      ) {
        res.status(400).send({ message: "Debes ingresar todos los campos." });
        return;
      }

      const purchase = await Purchase.create({
        products,
        intendedTotalPrice: intendedPrice,
        actualTotalPrice: totalPrice,
        paymentMethod,
        deliveryData,
        buyerData,
      });

      res.status(200).send({
        message: "Se ha creado la compra con éxito",
        data: { ...purchase.dataValues },
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Ocurrió un error al intentar crear la compra",
        error: e,
      });
    }
  },
};
