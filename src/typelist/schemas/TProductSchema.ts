import { DataTypes } from "sequelize";
import { sequelize } from "../../configs/database";
import { User } from "./TUserSchema";

// export const Product = sequelize.define(
//   "Product",
//   {
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     price: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     image: {
//       type: DataTypes.BLOB,
//       allowNull: false,
//     },
//     stock: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//   },
//   { tableName: "products" }
// );

// User.hasMany(Product, { as: "users", foreignKey: "owner" });
// Product.belongsTo(User, {
//   foreignKey: "owner",
// });

import {
  Table,
  Column,
  Model,
  BelongsTo,
  ForeignKey,
  DataType,
} from "sequelize-typescript";

@Table({ timestamps: true })
export class Product extends Model {
  @Column
  name!: string;

  @Column
  description!: string;

  @Column
  price!: number;

  @Column
  image!: string;

  @Column
  stock!: number;

  @BelongsTo(() => User)
  owner!: User;

  @ForeignKey(() => User)
  @Column
  ownerId!: number;
}
