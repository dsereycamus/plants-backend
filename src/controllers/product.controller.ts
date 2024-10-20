import { Request, Response } from "express";
import { Product } from "../typelist/schemas";

export const productController = {
  getAllProducts: async (_req: Request, res: Response): Promise<void> => {
    try {
      const products = await Product.findAll().then((products) =>
        products.map((product) => ({
          ...product.dataValues,
          image: product.image.toString("base64"),
        }))
      );
      res.status(200).send({
        message: "Se pudo conseguir el listado de productos",
        data: products,
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
  addNewProduct: async (req: Request, res: Response): Promise<void> => {
    try {
      const { user } = req;
      const { name, description, price, stock } = req.body;

      if (!name || !description || !price || !stock || !req.file) {
        res
          .status(400)
          .send({ message: "Debes ingresar todos los campos y la foto" });
        return;
      }
      const product = await Product.create({
        name,
        description,
        price,
        imageType: req.file?.mimetype,
        imageName: req.file?.originalname,
        image: req.file?.buffer,
        stock,
        ownerId: user!.id,
      });

      res.status(200).send({
        message: "Se ha creado el producto con éxito",
        data: { ...product.dataValues, image: null },
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Ocurrió un error al intentar crear el producto",
        error: e,
      });
    }
  },
  updateProduct: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, description, price, stock } = req.body;

      if (!name && !description && !price && !stock && !req.file) {
        res.status(400).send({ message: "Debes ingresar al menos un campo" });
        return;
      }
      if (!id || isNaN(parseInt(id))) {
        res
          .status(400)
          .send({ message: "Debes ingresar un ID de producto a modificar" });
        return;
      }

      const updateProduct = await Product.update(
        {
          name,
          description,
          price,
          stock,
          ...(req.file && {
            imageType: req.file?.mimetype,
            imageName: req.file?.originalname,
            image: req.file?.buffer,
          }),
        },
        { where: { id } }
      );

      res.status(200).send({
        message:
          updateProduct[0] === 1
            ? `Has actualizado el producto N°${id} con éxito`
            : `No se encuentra el producto con N°${id}`,
        data: updateProduct[0] === 1,
      });
      return;
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Ocurrió un error al intentar actualizar el producto",
        error: e,
      });
    }
  },
};
