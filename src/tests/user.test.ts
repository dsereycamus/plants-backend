import { app } from "../configs/server";
import request from "supertest";
import { User } from "../types/schemas";
import { config } from "dotenv";
import path from "path";
import { assertDatabaseConnection } from "../configs/database";
import { Server } from "http";
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

describe("POST /user/signup", () => {
  beforeAll(async () => {
    await User.create({
      email: "test@email.com",
      names: "Test",
      lastNames: "Test",
      password: "test",
    });
  });

  it("Devuelve estado 400 (Bad request) al faltar un campo.", async () => {
    const res = await request(server).post("/user/signup").send({
      names: "Daniela",
      lastNames: "Serey",
      email: "dsereycamus@gmail.com",
    });

    expect(res.statusCode).toEqual(400);
  });
  it("Devuelve estado 401 al intentar crear un usuario existente.", async () => {
    const res = await request(server).post("/user/signup").send({
      names: "test",
      lastNames: "test",
      email: "test@email.com",
      password: "test",
    });

    expect(res.statusCode).toEqual(401);
  });

  it("Crea exitosamente el usuario y devuelve el token.", async () => {
    const res = await request(server).post("/user/signup").send({
      names: "test",
      lastNames: "test",
      email: "test2@email.com",
      password: "test",
    });

    expect(res.statusCode).toEqual(200);
  });
  afterAll(async () => {
    await User.destroy({
      where: {
        email: "test@email.com",
      },
    });
  });
});

describe("POST /user/signin", () => {
  it("Devuelve estado 404 al no encontrar el usuario.", async () => {
    const res = await request(server).post("/user/signin").send({
      email: "test@gmail.com",
      password: "123",
    });

    expect(res.statusCode).toEqual(404);
  });
  it("Devuelve estado 401 al ingresar una contraseña incorrecta.", async () => {
    const res = await request(server).post("/user/signin").send({
      email: "test2@email.com",
      password: "test123",
    });
    expect(res.statusCode).toEqual(401);
  });

  it("Logea exitosamente.", async () => {
    const res = await request(server).post("/user/signin").send({
      email: "test2@email.com",
      password: "test",
    });

    token = res.body.token;

    expect(res.statusCode).toEqual(200);
  });
});

describe("GET /user", () => {
  it("Devuelve estado 401 al no poseer un token", async () => {
    const res = await request(server).get("/user").send();

    expect(res.statusCode).toEqual(401);
  });
  it("Devuelve estado 200 al ingresar el token que recibimos en las pruebas anteriores", async () => {
    const res = await request(server)
      .get("/user")
      .set({ authorization: `Bearer ${token}` })
      .send();
    expect(res.statusCode).toEqual(200);
  });

  afterAll(async () => {
    await User.destroy({
      where: {
        email: "test@email.com",
      },
    });
    await User.destroy({
      where: {
        email: "test2@email.com",
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
