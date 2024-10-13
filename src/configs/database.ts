import { config } from "dotenv";
import path from "path";
import { Sequelize } from "sequelize-typescript";
import { Product, Purchase, User } from "../types/schemas";

config({
  path: path.join(__dirname, "../../.env"),
});

const dbUri = process.env.DB_URI ?? "";
const environment = process.env.NODE_ENV ?? "development";

export const sequelize = new Sequelize(dbUri, {
  dialect: "postgres",
  models: [User, Product, Purchase],
});

export const assertDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    environment === "development" && (await sequelize.sync());
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
