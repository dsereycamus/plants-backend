import { Table, Column, Model, HasMany, Index } from "sequelize-typescript";
import { Product } from "./TProductSchema";

@Table({ timestamps: true })
export class User extends Model {
  @Column
  names!: string;

  @Column
  lastNames!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column
  password!: string;

  @HasMany(() => Product)
  products?: Product[];
}
