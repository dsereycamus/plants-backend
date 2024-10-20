import { app } from "../configs/server";
import request from "supertest";
import { config } from "dotenv";
import path from "path";
import { assertDatabaseConnection } from "../configs/database";
import { Server } from "http";
import { Product, User } from "../typelist/schemas";
config({
  path: path.join(__dirname, "../.env"),
});

let server: Server;
let token: string = "";
beforeAll(() => {
  server = app.listen(3000, async () => {
    await assertDatabaseConnection();
  });
});

describe("POST /products/add-new", () => {
  it("Devuelve estado 401 al no tener un token de autorización válido.", async () => {
    const res = await request(server).post("/products/add-new").send({
      name: "Producto",
      description: "Descripción de producto",
      price: 10000,
      stock: 10,
      // No se entrega la imagen.
    });
    expect(res.statusCode).toEqual(401);
  });
  it("Devuelve estado 400 (Bad request) al faltar un campo.", async () => {
    const getToken = await request(server).post("/user/signup").send({
      names: "test",
      lastNames: "test",
      email: "test@email.com",
      password: "test",
    });
    token = getToken.body.token;
    const res = await request(server)
      .post("/products/add-new")
      .set({ authorization: `Bearer ${token}` })
      .send({
        name: "Producto de prueba",
        description: "Descripción de producto",
        price: 10000,
        stock: 10,
        // No se entrega la imagen.
      });
    expect(res.statusCode).toEqual(400);
  });
  it("Devuelve estado 200.", async () => {
    const image = path.resolve(__dirname, `./test-image.png`);
    return await request(server)
      .post("/products/add-new")
      .set({ "Content-Type": "multipart/form-data" })
      .set({ authorization: `Bearer ${token}` })
      .field("name", "Producto de prueba")
      .field("description", "Descripción del producto")
      .field("price", 10000)
      .field("stock", 10)
      .attach("image", image)
      .expect(200);
  });

  afterAll(async () => {
    await User.destroy({
      where: {
        email: "test@email.com",
      },
    });
    await Product.destroy({
      where: {
        name: "Producto de prueba",
      },
    });
  });
});

afterAll(async () => {
  await new Promise((resolve) =>
    server.close(() => {
      resolve(null);
    })
  );
});
