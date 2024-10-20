import { Column, DataType, Model, Table } from "sequelize-typescript";
import { EPaymentMethods } from "../requests";

export class ProductData {
  public productId!: number;
  public amount!: number;
}

export class PurchaseBuyerData {
  public names!: string;
  public lastNames!: string;
  public email!: string;
}

export class PurchaseDeliveryData {
  public address!: string;
  public region!: string;
  public city!: string; //Comuna
  public zipCode!: string;
}

@Table({ timestamps: true })
export class Purchase extends Model {
  @Column(DataType.JSON)
  products!: ProductData[];

  @Column
  intendedTotalPrice!: number;

  @Column
  actualTotalPrice!: number;

  @Column({
    type: DataType.ENUM,
    values: Object.values(EPaymentMethods).map((x) => x.toString()),
  })
  paymentMethod!: EPaymentMethods;

  @Column(DataType.JSON)
  deliveryData!: PurchaseDeliveryData;

  @Column(DataType.JSON)
  buyerData!: PurchaseBuyerData;
}
